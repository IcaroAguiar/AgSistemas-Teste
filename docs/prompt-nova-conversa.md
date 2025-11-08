# Prompt Inicial para Nova Conversa - Implementação de Interfaces

## Contexto do Projeto

Estou trabalhando na feature `001-admissao-membros` da plataforma de gestão para grupos de networking. As APIs backend já estão implementadas e testadas. Agora preciso criar as interfaces de usuário com shadcn/ui.

## O que preciso fazer

Implementar 3 páginas principais:

1. **Área Administrativa** (`app/admin/page.tsx`)
   - Listar intenções em tabela
   - Aprovar/recusar intenções
   - Filtros por status

2. **Página de Cadastro** (`app/signup/[token]/page.tsx`)
   - Validar token
   - Formulário de cadastro completo
   - Estados de loading/erro/sucesso

3. **Dashboard** (`app/dashboard/page.tsx`)
   - Exibir 3 KPIs em cards
   - Membros ativos, indicações, obrigados

## Informações importantes

- **Branch**: `001-admissao-membros`
- **Stack**: Next.js 16, React 19.2, shadcn/ui, Tailwind CSS
- **APIs**: Todas já implementadas e funcionais
- **Documentação completa**: Ver `docs/context-ui-implementation.md`

## Como começar

Por favor, leia o arquivo `docs/context-ui-implementation.md` para entender o contexto completo e então:

1. Verificar quais componentes shadcn/ui precisam ser instalados
2. Criar as páginas seguindo os padrões estabelecidos
3. Implementar estados de loading/erro
4. Manter acessibilidade e responsividade
5. Fazer commits graduais conforme o trabalho progride

Posso começar pela área administrativa ou você prefere outra ordem?

