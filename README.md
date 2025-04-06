# Pendências do Aplicativo de Baralhos

Este documento lista as funcionalidades que ainda precisam ser implementadas ou finalizadas no aplicativo de baralhos.

---

## 🔧 Funcionalidades Pendentes

### 1. Carregamento Aleatório da Descrição
- Atualmente, a descrição do baralho aparece de forma fixa ao virar a carta.
- **Objetivo:** tornar a descrição exibida aleatória, caso o baralho possua mais de uma descrição cadastrada.

---

### 2. Criação de Novas Entidades ao Incluir Múltiplas Descrições
- Ao incluir mais de uma descrição, o sistema deve:
  - Criar **novas entidades** de descrição, e
  - Relacioná-las corretamente com o baralho correspondente.

---

### 3. Criar a Tela de Atualização de Baralho
- A tela deve permitir:
  - Buscar baralhos existentes,
  - Selecionar um baralho para edição,
  - Alterar o título, imagem e descrições.
- Status: rota `/atualizar` já criada, mas a tela ainda está vazia.

---

### 4. Criar a Tela de Exclusão de Baralho
- A tela deve permitir:
  - Listar baralhos existentes,
  - Selecionar e excluir um baralho da base de dados.
- Status: rota `/excluir` já criada, mas a tela ainda está vazia.

---

## ✅ O que já foi feito
- Botões de navegação criados na tela inicial (`index.ejs`);
- Rotas configuradas para `/atualizar` e `/excluir`;
- Estrutura básica de arquivos para as telas vazias criadas.

---

## 📌 Observações
- Ao implementar as funcionalidades acima, garantir também que a interface seja responsiva e acessível.
