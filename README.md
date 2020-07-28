# Recuperação de Senha
**RF**
	- O usuário deve poder recuperar sua senha informando seu e-mail;
	- O usuário deve receber um e-mail com intruções de recuperação de senha;
	- O usuário deve poder resetar sua renha;

**RNF**
	- Utilizar Mailtrap para testar envios em amviente de dev;
	- Utilizar Amazon SES para envios em produção;
	- O envio de e-mails deve acontecer em segundo plano (background job);

**RN**
	- O link enviado por email para resetar senha, deve expirar em 2h;
	- O usuáiro precisa confirmar a nova senha ao resetar sua senha;

# Atualização do Perfil
**RF**
	- O usuário deve poder atualizar seu nome, email e senha

**RN**
	- O usuário não pode alterar seu email para um email já utilizado;
	- Para atualizar sua senha, o usuário deve informar a senha antiga
	- Para atualizar sua senha, o usuário precisa confirmar nova senha

# Painel do Prestador
**RF**
	- O usuário deve poder listar seus agendamentos de um dia específico;
	- O prestador deve receber uma notificação sempre que houver um novo agendamento;
	- O prestador deve poder visualizar as notificações não lidas;

**RNF**
	- Os agendamentos do prestador do dia dever ser armazonados em cache;
	- As notificações do prestador devem ser armazenadas no MongoDB;
	- As notificações do prestador devem ser enviadas em tempo-real utilizando Socket.io;

**RN**
	-	A notificação deve ter um status de lida ou não-lida para o prestador possa controlar;


# Agendamento de Serviços
**RF**
	- O usuário deve poder listar todos prestadores de serviço cadastrados;
	- O usuário deve poder listar os dias de um mês com pelo menos um horário disponível de um prestador;
	- O usuário deve poder listar horários disponíveis em um dia específico de um prestador;
	- O usuario deve poder realizar um novo agendamento com um prestador;

**RNF**
	- A listagem de prestadores deve ser armazenada em cache;
	-

**RN**
	- Cada agendamento deve durar 1h exatamente;
	- Os agendamentos devem estar disóníveis entre 8h às 18h (primeiro às 8h, último às 17h);
	- O usuário não pode agentar em um horário já ocupado;
	- O usuário não pode agendar em um horário que já passou;
	- O usuário não pode agendar serviços consigo mesmo;
