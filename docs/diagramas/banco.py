"""Gera os diagramas do banco de dados do Freshly em SVG.

Uso: python3 banco.py ../img
Cria:
  mer.svg             Modelo Entidade-Relacionamento (notação de Chen)
  diagrama-tabelas.svg Diagrama de tabelas (modelo físico, com PK e FK)
"""
import math
import os
import sys

VERDE, VERDE_CLARO, TEXTO, LINHA, LARANJA, SUAVE = '#1D5C3F', '#E5EFDC', '#1F2A22', '#4A4F4B', '#B86E1A', '#6B706C'
FONTE = 'font-family="Helvetica, Arial, sans-serif"'


def svg(w, h, corpo, titulo):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" {FONTE}>'
            f'<rect width="{w}" height="{h}" fill="white"/>'
            f'<text x="{w / 2}" y="44" text-anchor="middle" font-size="24" font-weight="700" fill="{VERDE}">{titulo}</text>'
            + ''.join(corpo) + '</svg>')


# ---------------------------------------------------------------------
# MER (Chen): entidade = retângulo, relacionamento = losango,
# atributo = elipse (identificador sublinhado)
# ---------------------------------------------------------------------
def mer(saida):
    W, H = 1500, 860
    p = []
    usu = (300, 470)
    ali = (1080, 470)
    rel = (690, 470)

    def atributos(centro, itens, raio_x, raio_y, ang_ini, ang_fim):
        cx, cy = centro
        n = len(itens)
        for i, (nome, chave) in enumerate(itens):
            a = math.radians(ang_ini + (ang_fim - ang_ini) * (i / (n - 1) if n > 1 else 0.5))
            x, y = cx + raio_x * math.cos(a), cy + raio_y * math.sin(a)
            p.append(f'<line x1="{cx}" y1="{cy}" x2="{x:.1f}" y2="{y:.1f}" stroke="{LINHA}" stroke-width="1.4"/>')
            larg = max(60, 7.2 * len(nome) + 22)
            p.append(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{larg / 2:.1f}" ry="22" fill="white" stroke="{LINHA}" stroke-width="1.6"/>')
            deco = ' text-decoration="underline" font-weight="700"' if chave else ''
            p.append(f'<text x="{x:.1f}" y="{y + 5:.1f}" text-anchor="middle" font-size="14" fill="{TEXTO}"{deco}>{nome}</text>')

    atributos(usu, [('id', True), ('nome', False), ('email', False), ('senha', False), ('criado_em', False)], 210, 250, 110, 250)
    atributos(ali, [('id', True), ('nome', False), ('quantidade', False), ('unidade', False), ('categoria', False), ('local', False),
                    ('validade', False), ('preco', False), ('status', False), ('finalizado_em', False), ('criado_em', False)],
              300, 300, -125, 125)

    # ligações entidade ↔ relacionamento com cardinalidade
    p.append(f'<line x1="{usu[0] + 95}" y1="{usu[1]}" x2="{rel[0] - 85}" y2="{rel[1]}" stroke="{LINHA}" stroke-width="2"/>')
    p.append(f'<line x1="{rel[0] + 85}" y1="{rel[1]}" x2="{ali[0] - 95}" y2="{ali[1]}" stroke="{LINHA}" stroke-width="2"/>')
    p.append(f'<text x="{usu[0] + 120}" y="{usu[1] - 12}" font-size="16" font-weight="700" fill="{LARANJA}">(1,1)</text>')
    p.append(f'<text x="{ali[0] - 165}" y="{ali[1] - 12}" font-size="16" font-weight="700" fill="{LARANJA}">(0,N)</text>')

    # relacionamento
    rx, ry = rel
    p.append(f'<polygon points="{rx - 85},{ry} {rx},{ry - 55} {rx + 85},{ry} {rx},{ry + 55}" fill="#F8EADB" stroke="{LARANJA}" stroke-width="2"/>')
    p.append(f'<text x="{rx}" y="{ry + 6}" text-anchor="middle" font-size="17" font-weight="700" fill="{TEXTO}">cadastra</text>')

    # entidades por cima das linhas
    for (x, y), nome in [(usu, 'USUÁRIO'), (ali, 'ALIMENTO')]:
        p.append(f'<rect x="{x - 95}" y="{y - 32}" width="190" height="64" fill="{VERDE_CLARO}" stroke="{VERDE}" stroke-width="2.4"/>')
        p.append(f'<text x="{x}" y="{y + 7}" text-anchor="middle" font-size="19" font-weight="700" fill="{VERDE}">{nome}</text>')

    p.append(f'<text x="{W / 2}" y="{H - 24}" text-anchor="middle" font-size="14" fill="{SUAVE}">'
             'Um usuário cadastra nenhum ou vários alimentos; cada alimento pertence a exatamente um usuário. Atributo sublinhado = identificador.</text>')
    open(saida, 'w', encoding='utf-8').write(svg(W, H, p, 'Modelo Entidade-Relacionamento (MER): Freshly'))


# ---------------------------------------------------------------------
# Diagrama de tabelas (modelo físico)
# ---------------------------------------------------------------------
USERS = ('auth.users', 'gerenciada pelo Supabase Auth', [
    ('PK', 'id', 'uuid'),
    ('', 'email', 'varchar(255)'),
    ('', 'encrypted_password', 'varchar(255)'),
    ('', 'raw_user_meta_data', 'jsonb  { nome }'),
    ('', 'email_confirmed_at', 'timestamptz'),
    ('', 'last_sign_in_at', 'timestamptz'),
    ('', 'created_at', 'timestamptz'),
])
ALIMENTOS = ('public.alimentos', 'criada pelo supabase/schema.sql', [
    ('PK', 'id', 'uuid'),
    ('FK', 'user_id', 'uuid'),
    ('', 'nome', 'text (1 a 80)'),
    ('', 'quantidade', 'numeric(10,2)'),
    ('', 'unidade', 'text'),
    ('', 'categoria', 'text'),
    ('', 'local', 'text'),
    ('', 'validade', 'date'),
    ('', 'preco', 'numeric(10,2) nulo'),
    ('', 'status', 'text'),
    ('', 'finalizado_em', 'timestamptz nulo'),
    ('', 'criado_em', 'timestamptz'),
])


def tabelas(saida):
    W, H = 1300, 760
    p = []
    LW, LH, TOPO = 420, 40, 70

    def tabela(x, y, dados):
        nome, nota, cols = dados
        h = TOPO + LH * len(cols)
        p.append(f'<rect x="{x}" y="{y}" width="{LW}" height="{h}" rx="10" fill="white" stroke="{VERDE}" stroke-width="2"/>')
        p.append(f'<path d="M{x},{y + 10} a10,10 0 0 1 10,-10 h{LW - 20} a10,10 0 0 1 10,10 v{TOPO - 10} h-{LW} z" fill="{VERDE}"/>')
        p.append(f'<text x="{x + 18}" y="{y + 32}" font-size="20" font-weight="700" fill="white">{nome}</text>')
        p.append(f'<text x="{x + 18}" y="{y + 55}" font-size="13" fill="#CFE3D4">{nota}</text>')
        linhas = {}
        for i, (chave, col, tipo) in enumerate(cols):
            ly = y + TOPO + i * LH
            if i % 2:
                p.append(f'<rect x="{x + 1}" y="{ly}" width="{LW - 2}" height="{LH}" fill="#F6F7F3"/>')
            if chave:
                cor = '#C9A227' if chave == 'PK' else LARANJA
                p.append(f'<rect x="{x + 14}" y="{ly + 10}" width="34" height="20" rx="4" fill="{cor}"/>')
                p.append(f'<text x="{x + 31}" y="{ly + 25}" text-anchor="middle" font-size="12" font-weight="700" fill="white">{chave}</text>')
            peso = '700' if chave else '400'
            p.append(f'<text x="{x + 60}" y="{ly + 26}" font-size="15" font-weight="{peso}" fill="{TEXTO}">{col}</text>')
            p.append(f'<text x="{x + LW - 16}" y="{ly + 26}" text-anchor="end" font-size="14" fill="{SUAVE}">{tipo}</text>')
            linhas[col] = ly + LH / 2
        # contorno por cima das faixas, para a borda não sumir
        p.append(f'<rect x="{x}" y="{y}" width="{LW}" height="{h}" rx="10" fill="none" stroke="{VERDE}" stroke-width="2"/>')
        return linhas

    l_users = tabela(80, 110, USERS)
    l_ali = tabela(800, 110, ALIMENTOS)

    # ligação FK alimentos.user_id → users.id
    y1, y2 = l_users['id'], l_ali['user_id']
    x1, x2 = 80 + LW, 800
    xm = (x1 + x2) / 2
    p.append(f'<path d="M{x1},{y1} H{xm} V{y2} H{x2}" fill="none" stroke="{LARANJA}" stroke-width="2.2"/>')
    # lado "um": duas barras
    for dx in (14, 22):
        p.append(f'<line x1="{x1 + dx}" y1="{y1 - 10}" x2="{x1 + dx}" y2="{y1 + 10}" stroke="{LARANJA}" stroke-width="2.2"/>')
    # lado "muitos": pé de galinha + círculo (zero ou muitos)
    p.append(f'<path d="M{x2 - 22},{y2} L{x2},{y2 - 11} M{x2 - 22},{y2} L{x2},{y2 + 11}" stroke="{LARANJA}" stroke-width="2.2" fill="none"/>')
    p.append(f'<circle cx="{x2 - 32}" cy="{y2}" r="7" fill="white" stroke="{LARANJA}" stroke-width="2.2"/>')
    p.append(f'<text x="{x1 + 30}" y="{y1 - 12}" font-size="15" font-weight="700" fill="{LARANJA}">(1,1)</text>')
    p.append(f'<text x="{x2 - 70}" y="{y2 - 14}" font-size="15" font-weight="700" fill="{LARANJA}">(0,N)</text>')
    p.append(f'<text x="{xm}" y="{(y1 + y2) / 2 + 40}" text-anchor="middle" font-size="13" fill="{SUAVE}">on delete cascade</text>')

    # legenda
    ly = 110 + TOPO + LH * len(USERS[2]) + 50
    p.append(f'<rect x="80" y="{ly}" width="34" height="20" rx="4" fill="#C9A227"/><text x="97" y="{ly + 15}" text-anchor="middle" font-size="12" font-weight="700" fill="white">PK</text>')
    p.append(f'<text x="124" y="{ly + 15}" font-size="14" fill="{TEXTO}">Chave primária: identifica cada linha</text>')
    p.append(f'<rect x="80" y="{ly + 34}" width="34" height="20" rx="4" fill="{LARANJA}"/><text x="97" y="{ly + 49}" text-anchor="middle" font-size="12" font-weight="700" fill="white">FK</text>')
    p.append(f'<text x="124" y="{ly + 49}" font-size="14" fill="{TEXTO}">Chave estrangeira: aponta para a chave primária de outra tabela</text>')
    p.append(f'<text x="80" y="{ly + 90}" font-size="14" fill="{SUAVE}">auth.users mostra só as colunas que o Freshly usa.</text>')
    p.append(f'<text x="80" y="{ly + 112}" font-size="14" fill="{SUAVE}">Receitas e categorias ficam no código (src/data), não no banco.</text>')
    open(saida, 'w', encoding='utf-8').write(svg(W, H, p, 'Diagrama de Tabelas: Freshly'))


if __name__ == '__main__':
    pasta = sys.argv[1] if len(sys.argv) > 1 else '.'
    mer(os.path.join(pasta, 'mer.svg'))
    tabelas(os.path.join(pasta, 'diagrama-tabelas.svg'))
