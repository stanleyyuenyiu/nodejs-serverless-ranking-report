import { createForms } from 'react-redux-form';

const initLogin = { password: '', user: '' };

export default createForms({
  login: initLogin
})