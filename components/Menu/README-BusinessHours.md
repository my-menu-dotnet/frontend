# Business Hours in Menu

Implementação dos horários de funcionamento na área pública do menu (cardápio digital).

## 📁 Arquivos Criados/Modificados

```
components/Menu/
├── Header.tsx                     # Atualizado para incluir horários
└── components/
    ├── BusinessHoursDisplay.tsx   # Componente completo com status e lista
    ├── BusinessStatus.tsx         # Componente compacto só com status
    └── index.ts                   # Exports atualizados

types/api/
└── Company.d.ts                   # Corrigido: image e header agora são FileStorage
```

## 🚀 Funcionalidades Implementadas

### 📅 BusinessHoursDisplay
Componente completo que exibe:
- **Status atual**: "Aberto agora" ou "Fechado agora" 
- **Horário de hoje**: Horários de abertura e fechamento do dia atual
- **Lista expansível**: Todos os horários da semana (clicável)
- **Indicador visual**: Ícone de relógio com cor da empresa

### 🔵 BusinessStatus  
Componente compacto que exibe apenas:
- **Indicador visual**: Ponto verde (aberto) ou vermelho (fechado)
- **Status textual**: "Aberto agora", "Fechado hoje", etc.
- **Tamanho mínimo**: Para uso em espaços limitados

## 🎯 Localização no Menu

### Header Principal
Os horários aparecem no header do menu, logo abaixo do endereço da empresa:
- Integrado de forma discreta
- Utiliza a cor primária da empresa
- Responsivo para mobile/desktop

## 🧮 Lógica de Negócio

### Cálculo de Status
```typescript
// Detecta dia atual (segunda = 0, domingo = 6)
const currentDay = dayOrder[now.getDay() === 0 ? 6 : now.getDay() - 1];

// Converte horário atual para minutos desde meia-noite
const currentTime = now.getHours() * 60 + now.getMinutes();

// Compara com horários de abertura/fechamento
const isOpen = currentTime >= openTime && currentTime <= closeTime;
```

### Estados Possíveis
1. **"Aberto agora"** - Verde: Dentro do horário de funcionamento
2. **"Fechado agora"** - Vermelho: Fora do horário mas dia de funcionamento  
3. **"Fechado hoje"** - Vermelho: Dia marcado como fechado (is_closed: true)
4. **"Horário não definido"** - Cinza: Sem horários cadastrados

## 🎨 Design e UX

### Experiência do Usuário
- **Informação clara**: Status imediato e visível
- **Detalhes opcionais**: Lista completa disponível mas não intrusiva
- **Consistência visual**: Cores da empresa mantidas
- **Mobile-friendly**: Interface otimizada para touch

### Estados Visuais
```css
/* Aberto */
.text-green-600 { color: #059669; }
.bg-green-500 { background: #10b981; }

/* Fechado */  
.text-red-600 { color: #dc2626; }
.bg-red-500 { background: #ef4444; }

/* Indefinido */
.text-gray-500 { color: #6b7280; }
```

## 🔧 Correções Implementadas

### Tipos da Company
Corrigido no `Company.d.ts`:
```typescript
// ANTES (FileStorage)
image: FileStorage;
header?: FileStorage;

// DEPOIS (String direto da API)  
image: string;
header?: string;
```

### Compatibilidade
- Todos os usos de `company.image` agora acessam diretamente a URL
- `company.header` também é string direta quando existe
- API retorna apenas a URL como string

## 📱 Responsividade

### Mobile (< 768px)
- Layout compacto no header
- Lista de horários em accordion
- Touch targets adequados

### Desktop (> 768px)  
- Espaçamento otimizado
- Hover states nos elementos interativos
- Tipografia clara e legível

## 🚀 Uso nos Componentes

### Header (Uso Principal)
```tsx
{menu.company.business_hours && menu.company.business_hours.length > 0 && (
  <BusinessHoursDisplay
    businessHours={menu.company.business_hours}
    color={color}
    className="mt-2"
  />
)}
```

### Uso Compacto (Opcional)
```tsx
<BusinessStatus
  businessHours={menu.company.business_hours}
  className="ml-2"
  showIcon={true}
/>
```

## 🎯 Benefícios para o Negócio

1. **Transparência**: Clientes sabem quando a empresa está aberta
2. **Redução de contatos**: Menos ligações perguntando sobre funcionamento  
3. **Profissionalismo**: Visual moderno e informativo
4. **Experiência**: Informação relevante na hora certa
5. **Conversão**: Clientes sabem quando podem fazer pedidos

## 🔮 Extensões Futuras

A implementação atual permite facilmente adicionar:
- **Horários especiais**: Feriados, eventos
- **Avisos dinâmicos**: "Fechado excepcionalmente hoje"
- **Delivery vs presencial**: Horários diferentes por tipo
- **Múltiplos turnos**: Manhã/tarde/noite separados
- **Notificações**: Avisar quando abrir/fechar
