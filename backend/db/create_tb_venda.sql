create table tb_venda (
	id bigserial not null primary key,
	id_cliente bigint references tb_cliente(id) not null,
	forma_pagamento varchar(50) check (forma_pagamento in ('DINHEIRO', 'CARTAO')) not null,
	total numeric(16,2) not null,
	add column data_venda timestamp default now()

);