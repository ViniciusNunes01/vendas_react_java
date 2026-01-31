create table tb_item_venda (
	id bigserial not null primary key,
	id_venda bigint references tb_venda(id) not null,
	id_produto bigint references tb_produto(id) not null,
	quantidade integer not null
);