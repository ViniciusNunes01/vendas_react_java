create table tb_cliente (
	id bigserial not null primary key,
	nascimento date not null,
	nome varchar(100) not null,
	endereco varchar(255) not null,
	cpf varchar(14) not null,
	telefone varchar(14),
	email varchar(100),
	data_cadastro date
)