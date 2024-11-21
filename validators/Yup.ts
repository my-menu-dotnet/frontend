import * as Yup from 'yup';

Yup.setLocale({
  mixed: {
    required: 'Campo obrigatório',
    default: 'Campo inválido',
  },
  string: {
    email: 'Email inválido',
  },
});

export default Yup;