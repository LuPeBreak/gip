# 📋 GIP - Gestão Interna de Processos de Licitação

## 1. Identidade do Projeto
- **Nome:** GIP (Gestão Interna de Processos)
- **Setor:** Licitação - Secretaria de Administração (Prefeitura de Barra Mansa)
- **Objetivo:** Otimizar o controle interno e a rastreabilidade dos processos licitatórios. O sistema visa eliminar a dúvida sobre "em qual mesa está o processo", fornecendo histórico detalhado de movimentações, status em tempo real e relatórios gerenciais, complementando o sistema oficial de protocolo municipal.

---

## 2. Regras de Negócio e Requisitos Funcionais

### 2.1. Gestão e Controle de Posse (Core)
O conceito central do sistema é a **POSSE**. Um processo só pode ser manipulado por quem detém sua posse atual.

- **[RN-001] Criação de Processos:**
    - **Dados:** Número e Descrição.
    - **Formato do Número:** Entrada manual (String). Padrão sugerido: `1234/2026`. Não é gerado automaticamente.
    - Ao ser criado, o processo nasce na posse do usuário criador com status `ABERTO`.
- **[RN-002] Finalização de Processos:**
    - Apenas o usuário que detém a posse atual de um processo `ABERTO` pode finalizá-lo.
    - Processos finalizados permanecem na posse do usuário que os finalizou.
- **[RN-003] Reabertura de Processos:**
    - Apenas o usuário que detém a posse de um processo `FINALIZADO` pode reabri-lo.
    - O processo retorna ao status `ABERTO` e permanece na posse do mesmo usuário.
- **[RN-004] Exclusividade de Ação:**
    - É vedada qualquer ação de movimentação, finalização ou envio externo em processos que **não** estejam na posse do usuário logado, exceto em casos de **Intervenção Administrativa** (ver [RN-017]).
- **[RN-018] Exclusão de Processos:**
    - **Restrição Rígida:** Um processo **SÓ** pode ser excluído se **NÃO** possuir histórico de tramitação (movimentações), ou seja, se estiver na posse do criador e nunca tiver sido enviado.
    - Objetivo: Permitir corrigir erros de cadastro imediato (ex: erro de numeração).
    - **Se já houve movimentação:** O processo torna-se **IMUTÁVEL**. Não pode ser editado nem excluído.

- **[RN-019] Edição de Processos (Correção Administrativa):**
    - **Quem pode editar:** Apenas **ADMINISTRADORES**.
    - **Quando:** A qualquer momento, independente de onde o processo esteja (mesa de outro usuário, externo, etc).
    - **O que pode ser editado:** Número e Descrição.
    - **Objetivo:** Corrigir erros de cadastro que foram percebidos tardiamente, evitando a necessidade de excluir e perder histórico.
    - **Auditoria:** Toda edição deve gerar um log de "Alteração de Dados" no histórico do processo.




### 2.2. Tramitação Interna (Movimentação)
- **[RN-005] Envio de Trâmite:**
    - **Liberdade de Envio:** O usuário pode enviar o processo para **QUALQUER** outro usuário ativo no sistema (exceto para si mesmo). Não há restrição de hierarquia ou setor.
    - O processo entra em status de trâmite `PENDENTE`. **IMPORTANTE:** O processo **NÃO SAI** da caixa de "Meus Processos Ativos" do remetente até que o destinatário aceite. Ele apenas fica com um indicativo visual de que está aguardando aceite (ficando bloqueado para outras movimentações enquanto estiver nesse estado).
    - **Restrição:** Um processo não pode ter mais de uma movimentação `PENDENTE` simultânea.
    - **Dados:** O remetente pode adicionar uma "Observação" (Notes) opcional ao trâmite.
- **[RN-006] Recebimento e Aceite/Recusa:**
    - O destinatário deve visualizar processos enviados para ele numa "Caixa de Entrada".
    - **Aceite:** Ao aceitar, a posse do processo é transferida para o destinatário e o status volta a ser `ABERTO`.
    - **Recusa:** Ao recusar, o trâmite é cancelado e a posse retorna imediatamente ao remetente original. O motivo da recusa deve ser registrado.
- **[RN-007] Cancelamento de Envio:**
    - O remetente pode cancelar um trâmite enviado **enquanto este ainda estiver `PENDENTE`** (ex: enviou para a pessoa errada ou o destinatário demorou muito para aceitar).
    - Ao cancelar, o processo retorna ao status `ABERTO` na posse plena do remetente e o trâmite pendente é desfeito **sem gerar histórico imutável** (funciona como um "desfazer" ou correção de erro).

### 2.3. Tramitação Externa
- **[RN-008] Envio para Externo:**
    - O usuário em posse de um processo pode enviá-lo para um setor externo (ex: Jurídico).
    - O processo assume o status `EXTERNO` e a posse fica congelada.
- **[RN-009] Recuperação de Externo:**
    - O sistema deve permitir "recuperar" um processo que está em setor externo.
    - **Quem pode recuperar:** Apenas o usuário que enviou **OU** qualquer Administrador (ver [RN-017]).
    - Ao recuperar, o usuário assume a posse do processo, trazendo-o de volta para o status `ABERTO`.

### 2.4. Administração e Gestão de Crise (Admin Override)
- **[RN-017] Intervenção Administrativa:**
    - Administradores possuem "Super Poderes" para destravar processos parados (ex: funcionário doente/férias).
    - **Ações:**
        1.  **Tomada de Posse (Take Over):** Admin puxa qualquer processo para sua própria mesa.
        2.  **Transferência Forçada (Force Transfer):** Admin move processo da mesa de User A diretamente para User B.
    - **Regra de Ouro:** Estas ações **NÃO** requerem aceite do destinatário. A troca de posse é imediata.
    - **Auditoria:** Obrigatório gerar histórico automático ("Movimentação Administrativa: [Motivo]").

### 2.5. Visualização e Busca
- **[RN-010] Visibilidade de Posse (Meus Processos):**
    - O usuário deve ter uma visão clara de todos os processos sob sua responsabilidade, segmentados por status.
- **[RN-011] Histórico de Movimentações (Auditoria Central):**
    - Todo processo deve possuir um log auditável imutável contendo todas as mudanças de status (Criação, Finalização, Reabertura, Envio Externo, Retorno), transferências de posse (Trâmites consolidados) e edições de dados.
    - **Função Principal:** Esta é a principal e mais importante ferramenta de auditoria do sistema. O objetivo é responder com exatidão a perguntas cruciais: "Por onde o processo X passou?", "Quem foi a última pessoa com a posse?", "Há quanto tempo o processo Y está na etapa Z?". A rastreabilidade imutável através da linha do tempo ("Criado", "Tramitado de A para B", "Aceite por B", etc) é tudo que o sistema precisa para extinguir o controle paralelo em planilhas e garantir a transparência da posse física.
- **[RN-012] Busca Global:**
    - Pesquisa por Número ou Descrição, retornando status atual e quem detém a posse.

### 2.6. Relatórios Gerenciais (Para Admins)
- **[RN-013] Exportação de Dados:**
    - Administradores devem poder gerar relatórios (Excel/.xlsx) contendo:
        1.  Número do Processo
        2.  Descrição
        3.  Status Atual
        4.  **Localização (Micro-Setor):** Define a "Etapa" atual do processo (ex: "Compras", "Jurídico"). É determinado pelo Micro-Setor do usuário que detém a posse.
        5.  Data da Última Movimentação

### 2.7. Administração e Gestão de Acesso
- **[RN-014] Gestão de Usuários (Exclusive Admin):**
    - **Criação de Contas:** Somente Administradores podem criar novas contas de usuário. **Não existe cadastro público (Sign Up).**
    - **Papeis (Roles):** O sistema possui apenas dois níveis de acesso:
        1.  **User (Padrão):** Cria, recebe, tramita e finaliza processos. Acesso restrito aos seus próprios processos e caixa de entrada.
        2.  **Admin (Gestor):** Acesso total. Pode gerenciar usuários, setores e realizar intervenções em qualquer processo (ver [RN-017]).
    - **Reset de Senha:** Admins podem redefinir a senha de qualquer usuário.
- **[RN-015] Gestão de Micro-Setores:**
    - Admins podem criar, editar e desativar Micro-Setores (ex: Pregão, Contratos).
    - Validação: Não permitir apagar setor com usuários vinculados.

### 2.8. Autogestão e Autenticação
- **[RN-016] Edição de Perfil:**
    - Todo usuário logado deve poder alterar seu próprio Nome de Exibição e Senha.
- **[RN-020] Autenticação:**
    - **Login:** Acesso via Email e Senha.
    - **Logout:** O usuário deve ter a opção clara de sair o sistema, invalidando a sessão atual.

- **[RN-021] Notificações e Limbo (Futuro / V2):**
    - O sistema enviará um **Email de Notificação** para o usuário destinatário sempre que um processo for enviado para sua caixa de entrada (`PENDENTE`).
    - A interface alertará visualmente quando houver processos "Pardos/Pendentes" há muito tempo, combatendo o "Limbo" (onde o sistema diz que está com A, mas o papel já foi deixado na mesa de B).

---

## 3. Pilha Tecnológica e Restrições de Escopo

### 3.1. Tecnologias Adotadas
- **Frontend:** Next.js (App Router), React, TypeScript.
- **Autenticação:** Better Auth.
- **Banco de Dados e ORM:** PostgreSQL com Prisma.

### 3.2. Restrições de Escopo
- **Sem Upload de Arquivos:** O sistema não armazena documentos digitais (PDFs, Imagens). O foco é o controle interno e rastreamento da posse do processo físico entre os micro-setores.
- **Foco Facilitador:** Não visa ser um sistema complexo ou exaustivo de auditoria. O objetivo é ser um controle interno facilitado, simples de usar e altamente eficaz na sua missão de extinguir o uso de planilhas de controle, permitindo que a equipe encontre rapidamente com quem está cada processo em qual etapa (micro-setor).
- **Rápida Execução:** O sistema deve ser otimizado para velocidade (Next.js, Server Actions).
- **Responsividade:** Deve funcionar de forma fluida em Desktop e Mobile.

---

## 4. Dados e Estrutura (Proposta de Glossário)
*Baseado no Schema Atual e Futuro*

- **Micro-Setor:** Subdivisão interna da Licitação (Etapa).
- **Profile (Usuário):** Servidor com acesso ao sistema, vinculado a um micro-setor.
- **Processo:** Entidade principal (`status`: `open`, `finished`, `external`).
- **Movimentação (Tramite):** Registro da transferência de posse (`pending`, `accepted`, `rejected`, `system_audit`).
- **Delete Constraint:** `ON DELETE RESTRICT` (Processos com movimentação não podem ser excluídos).
