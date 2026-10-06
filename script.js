// ============================================
// 1. CONEXÃO COM O SUPABASE
// ============================================
// ⚠️ TROQUE AQUI PELAS SUAS CHAVES:
const SUPABASE_URL = 'https://mdeettkvwkopovadlcss.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kZWV0dGt2d2tvcG92YWRsY3NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMTgyMzksImV4cCI6MjEwNjg5NDIzOX0.-JidQ9dQ92FkFbpoGDTjFW4YWlaBJgKzxm83Sa3wjYg';

const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================
// 2. ELEMENTOS DA PÁGINA
// ============================================
const telaCadastro   = document.getElementById('tela-cadastro');
const telaLogin      = document.getElementById('tela-login');
const telaInterna    = document.getElementById('tela-interna');
const telaRecuperar  = document.getElementById('tela-recuperar');
const telaNovaSenha  = document.getElementById('tela-nova-senha');

const msg          = document.getElementById('msg');
const emailUsuario = document.getElementById('email-usuario');

// ============================================
// 3. FUNÇÕES AUXILIARES
// ============================================
function mostrar(texto, tipo) {
  msg.textContent = texto;
  msg.className = 'msg ' + (tipo || '');
}

// Esconde TODAS as telas
function esconderTodas() {
  telaCadastro.classList.add('escondido');
  telaLogin.classList.add('escondido');
  telaInterna.classList.add('escondido');
  telaRecuperar.classList.add('escondido');
  telaNovaSenha.classList.add('escondido');
}

// Mostra só uma tela
function mostrarTela(tela) {
  esconderTodas();
  tela.classList.remove('escondido');
}

// ============================================
// 4. TROCAR ENTRE TELAS
// ============================================
document.getElementById('ir-login').onclick = () => {
  mostrarTela(telaLogin);
  mostrar('');
};

document.getElementById('ir-cadastro').onclick = () => {
  mostrarTela(telaCadastro);
  mostrar('');
};

document.getElementById('ir-recuperar').onclick = () => {
  mostrarTela(telaRecuperar);
  mostrar('');
};

document.getElementById('voltar-login').onclick = () => {
  mostrarTela(telaLogin);
  mostrar('');
};

// ============================================
// 5. CADASTRAR
// ============================================
document.getElementById('btn-cadastrar').onclick = async () => {
  const email  = document.getElementById('cad-email').value.trim();
  const senha  = document.getElementById('cad-senha').value;
  const senha2 = document.getElementById('cad-senha2').value;

  if (!email || !senha) {
    mostrar('Preencha todos os campos.', 'erro');
    return;
  }
  if (senha.length < 6) {
    mostrar('A senha precisa ter pelo menos 6 caracteres.', 'erro');
    return;
  }
  if (senha !== senha2) {
    mostrar('As senhas não são iguais.', 'erro');
    return;
  }

  mostrar('Criando conta...', '');

  const { error } = await client.auth.signUp({
    email: email,
    password: senha
  });

  if (error) {
    mostrar('Erro: ' + error.message, 'erro');
    return;
  }

  mostrar('Conta criada com sucesso!', 'ok');
  document.getElementById('cad-email').value  = '';
  document.getElementById('cad-senha').value  = '';
  document.getElementById('cad-senha2').value = '';

  setTimeout(() => {
    mostrarTela(telaLogin);
    mostrar('Agora faça login com sua nova conta.', 'ok');
  }, 1000);
};

// ============================================
// 6. LOGIN
// ============================================
document.getElementById('btn-entrar').onclick = async () => {
  const email = document.getElementById('login-email').value.trim();
  const senha = document.getElementById('login-senha').value;

  if (!email || !senha) {
    mostrar('Preencha todos os campos.', 'erro');
    return;
  }

  mostrar('Entrando...', '');

  const { error } = await client.auth.signInWithPassword({
    email: email,
    password: senha
  });

  if (error) {
    mostrar('Erro: ' + error.message, 'erro');
    return;
  }

  mostrar('Login feito com sucesso!', 'ok');
  document.getElementById('login-email').value = '';
  document.getElementById('login-senha').value = '';
};

// ============================================
// 7. RECUPERAR SENHA (enviar e-mail)
// ============================================
document.getElementById('btn-recuperar').onclick = async () => {
  const email = document.getElementById('rec-email').value.trim();

  if (!email) {
    mostrar('Digite seu e-mail.', 'erro');
    return;
  }

  mostrar('Enviando link...', '');

  // redirectTo: para onde o Supabase manda o usuário depois do clique
  const { error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + window.location.pathname
  });

  if (error) {
    mostrar('Erro: ' + error.message, 'erro');
    return;
  }

  mostrar('Link enviado! Verifique seu e-mail (e o spam).', 'ok');
  document.getElementById('rec-email').value = '';
};

// ============================================
// 8. SALVAR NOVA SENHA (depois do link)
// ============================================
document.getElementById('btn-salvar-senha').onclick = async () => {
  const s1 = document.getElementById('nova-senha').value;
  const s2 = document.getElementById('nova-senha2').value;

  if (!s1 || !s2) {
    mostrar('Preencha os dois campos.', 'erro');
    return;
  }
  if (s1.length < 6) {
    mostrar('A senha precisa ter pelo menos 6 caracteres.', 'erro');
    return;
  }
  if (s1 !== s2) {
    mostrar('As senhas não são iguais.', 'erro');
    return;
  }

  mostrar('Salvando...', '');

  const { error } = await client.auth.updateUser({ password: s1 });

  if (error) {
    mostrar('Erro: ' + error.message, 'erro');
    return;
  }

  mostrar('Senha alterada com sucesso!', 'ok');
  document.getElementById('nova-senha').value  = '';
  document.getElementById('nova-senha2').value = '';

  // Depois de trocar a senha, o usuário já fica logado
  setTimeout(() => {
    mostrarTela(telaInterna);
  }, 1200);
};

// ============================================
// 9. SAIR
// ============================================
document.getElementById('btn-sair').onclick = async () => {
  await client.auth.signOut();
  mostrar('Você saiu da conta.', 'ok');
};

// ============================================
// 10. MONITORAR ESTADO DE LOGIN
// ============================================
client.auth.onAuthStateChange((event, session) => {

  // 🔥 Evento especial: usuário clicou no link do e-mail
  if (event === 'PASSWORD_RECOVERY') {
    mostrarTela(telaNovaSenha);
    mostrar('Digite sua nova senha.', 'ok');
    return;
  }

  if (session && session.user) {
    // LOGADO → tela interna
    mostrarTela(telaInterna);
    emailUsuario.textContent = session.user.email;
  } else {
    // DESLOGADO → tela de login
    mostrarTela(telaLogin);
    emailUsuario.textContent = '';
  }
});