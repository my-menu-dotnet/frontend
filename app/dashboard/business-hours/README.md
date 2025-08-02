# Business Hours Management

Implementação completa do gerenciamento de horários de funcionamento da empresa no DigiMenu Frontend.

## 📁 Estrutura de Arquivos

```
app/dashboard/business-hours/
└── page.tsx                              # Página principal

components/Dashboard/BusinessHours/
├── index.ts                              # Exports dos componentes
└── DayScheduleEditor.tsx                 # Editor para cada dia da semana

hooks/
├── queries/
│   └── useBusinessHours.tsx              # Hook para buscar horários
└── mutate/
    └── useUpdateBusinessHours.tsx        # Hook para atualizar horários

types/api/
└── BusinessHours.d.ts                    # Tipos TypeScript
```

## 🚀 Funcionalidades

### 📅 Gerenciamento de Horários
- **Editor por Dia**: Configuração individual para cada dia da semana
- **Toggle Aberto/Fechado**: Switch para habilitar/desabilitar funcionamento
- **Seletor de Horário**: Componentes de time input para abertura e fechamento
- **Ações Rápidas**: Botões para configurar padrões comuns
- **Visualização em Tempo Real**: Interface atualizada instantaneamente

### 🔄 APIs Consumidas
1. **GET /company/business-hours** - Buscar horários atuais
2. **PUT /company/business-hours** - Atualizar horários

### 🎨 Componentes

#### DayScheduleEditor
Editor individual para cada dia com:
- Nome do dia em português
- Switch para aberto/fechado
- Time inputs para horários de abertura e fechamento
- Validação de horários
- Formatação automática (HH:MM:SS)

#### BusinessHoursPage
Página principal com:
- Lista de todos os dias da semana
- Ações rápidas para configurações comuns
- Botão de salvar com loading state
- Cards informativos
- Layout responsivo

### 🛠️ Hooks Customizados

#### useBusinessHours
- **React Query** para cache e loading states
- **StaleTime**: 5 minutos
- **Retry**: false para evitar tentativas desnecessárias
- **TypeScript** com tipagem completa

#### useUpdateBusinessHours
- **Mutation** para atualizar horários
- **Invalidação automática** do cache
- **Toast notifications** para success/error
- **Loading states** para UI

### 🎯 Tipos TypeScript

```typescript
type DayOfWeek = 
  | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" 
  | "FRIDAY" | "SATURDAY" | "SUNDAY";

type BusinessHours = {
  id?: string;
  day_of_week: DayOfWeek;
  opening_time?: string;  // Format: "HH:MM:SS"
  closing_time?: string;  // Format: "HH:MM:SS"
  is_closed: boolean;
};
```

### ⚡ Ações Rápidas

1. **Abrir Todos os Dias**: Configura 08:00-18:00 para todos os dias
2. **Só Dias Úteis**: Abre segunda-sexta, fecha fins de semana
3. **Fechar Domingo**: Mantém configurações atuais, mas fecha domingo

### 🎨 Interface

#### Layout Responsivo
- **Desktop**: Layout completo com sidebar
- **Mobile**: Interface otimizada para toque
- **Tablet**: Grid adaptativo

#### Estados Visuais
- **Loading**: Skeletons durante carregamento
- **Saving**: Botão com spinner durante salvamento
- **Success/Error**: Toast notifications

#### UX Features
- **Time Input**: Componentes nativos do NextUI
- **24h Format**: Formato brasileiro (HH:MM)
- **Validation**: Prevenção de horários inválidos
- **Auto-save**: Salvamento manual com confirmação

### 📱 Responsividade

- **Mobile First**: Design otimizado para dispositivos móveis
- **Touch Friendly**: Componentes grandes para toque
- **Accessible**: Suporte a leitores de tela
- **Fast Loading**: Otimizado para conexões lentas

## 🚀 Como Usar

1. Acesse `/dashboard/business-hours` no menu lateral
2. Use os switches para abrir/fechar cada dia
3. Configure horários de abertura e fechamento
4. Use ações rápidas para padrões comuns
5. Clique em "Salvar Horários" para persistir

## 🔧 Configuração da API

### Request Format (PUT)
```json
{
  "business_hours": [
    {
      "day_of_week": "MONDAY",
      "opening_time": "08:00:00",
      "closing_time": "18:00:00",
      "is_closed": false
    },
    {
      "day_of_week": "SUNDAY", 
      "is_closed": true
    }
  ]
}
```

### Response Format (GET)
```json
[
  {
    "id": "uuid",
    "day_of_week": "MONDAY",
    "opening_time": "08:00:00",
    "closing_time": "18:00:00",
    "is_closed": false
  }
]
```

## 🆘 Tratamento de Erros

- **Network Errors**: Toast de erro com mensagem clara
- **Validation Errors**: Feedback visual nos campos
- **Loading States**: Indicadores visuais
- **Retry Logic**: Tentativas automáticas em falhas de rede

## 🔒 Validações

1. **Horário de Abertura**: Deve ser anterior ao fechamento
2. **Formato de Tempo**: Validação automática (HH:MM:SS)
3. **Dias Obrigatórios**: Todos os 7 dias devem ser configurados
4. **Estado Consistente**: Dias fechados não podem ter horários

## 🎨 Design System

- **NextUI Components**: TimeInput, Switch, Button
- **Tailwind CSS**: Estilização consistente
- **React Icons**: Ícones uniformes (FiClock, FiSave)
- **Block Container**: Wrapper padrão do projeto
- **Color Scheme**: Cores consistentes com o tema

## 🔧 Extensibilidade

A arquitetura permite fácil adição de:
- **Horários Especiais**: Feriados, eventos especiais
- **Múltiplos Turnos**: Manhã/tarde separados
- **Timezone Support**: Diferentes fusos horários
- **Validações Avançadas**: Regras de negócio específicas
- **Histórico**: Log de mudanças de horários
- **Templates**: Salvamento de configurações padrão
