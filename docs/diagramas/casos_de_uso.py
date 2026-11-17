"""Gera o diagrama de casos de uso do Freshly em SVG (notação UML).

Uso: python3 casos_de_uso.py ../img/casos-de-uso.svg
As posições são fixas para o desenho ficar limpo, sem linhas cruzando.
"""
import sys

W, H = 1400, 1180
VERDE, VERDE_CLARO, TEXTO, LINHA, LARANJA = '#1D5C3F', '#E5EFDC', '#1F2A22', '#4A4F4B', '#B86E1A'
RX, RY = 150, 36
XA, XB = 520, 890  # colunas de casos de uso

CASOS = {
    'UC01': (XA, 160, 'Criar conta'),
    'UC02': (XA, 255, 'Fazer login'),
    'UC13': (XA, 350, 'Instalar o app'),
    'UC03': (XA, 470, 'Sair da conta'),
    'UC04': (XA, 560, 'Cadastrar alimento'),
    'UC05': (XA, 650, 'Editar alimento'),
    'UC07': (XA, 760, 'Consultar o que consumir primeiro'),
    'UC10': (XA, 870, 'Ativar e receber alertas'),
    'UC11': (XA, 960, 'Consultar receitas sugeridas'),
    'UC12': (XA, 1050, 'Consultar economia do mês'),
    'UC06': (XB, 650, 'Excluir alimento'),
    'UC08': (XB, 730, 'Buscar alimento'),
    'UC09': (XB, 830, 'Registrar consumo ou descarte'),
}
ATORES = {
    'Visitante': (110, 230),
    'Usuário': (110, 740),
    'Supabase (sistema externo)': (1290, 300),
    'Navegador / celular': (1290, 930),
}
ASSOC = [
    ('Visitante', 'UC01'), ('Visitante', 'UC02'), ('Visitante', 'UC13'),
    *[('Usuário', u) for u in ['UC03', 'UC04', 'UC05', 'UC07', 'UC10', 'UC11', 'UC12']],
    ('Supabase (sistema externo)', 'UC01'), ('Supabase (sistema externo)', 'UC02'), ('Supabase (sistema externo)', 'UC03'),
    ('Navegador / celular', 'UC10'),
]
RELACOES = [  # (origem, destino, estereótipo)
    ('UC01', 'UC02', 'include'),
    ('UC06', 'UC05', 'extend'),
    ('UC08', 'UC07', 'extend'),
    ('UC09', 'UC07', 'extend'),
]


def borda_elipse(cx, cy, px, py):
    """Ponto na borda da elipse na direção de (px, py)."""
    dx, dy = px - cx, py - cy
    if dx == 0 and dy == 0:
        return cx, cy
    k = 1 / ((dx / RX) ** 2 + (dy / RY) ** 2) ** 0.5
    return cx + dx * k, cy + dy * k


def ator(nome, x, y):
    linhas = nome.replace(' (', '\n(').split('\n')
    texto = ''.join(f'<tspan x="{x}" dy="{0 if i == 0 else 18}">{t}</tspan>' for i, t in enumerate(linhas))
    return f'''<g stroke="{TEXTO}" stroke-width="3" fill="none" stroke-linecap="round">
  <circle cx="{x}" cy="{y - 48}" r="13"/>
  <line x1="{x}" y1="{y - 35}" x2="{x}" y2="{y + 5}"/>
  <line x1="{x - 24}" y1="{y - 20}" x2="{x + 24}" y2="{y - 20}"/>
  <line x1="{x}" y1="{y + 5}" x2="{x - 20}" y2="{y + 40}"/>
  <line x1="{x}" y1="{y + 5}" x2="{x + 20}" y2="{y + 40}"/>
</g>
<text x="{x}" y="{y + 66}" text-anchor="middle" font-size="16" font-weight="600" fill="{TEXTO}">{texto}</text>'''


def main(saida):
    p = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family="Helvetica, Arial, sans-serif">',
         f'<rect width="{W}" height="{H}" fill="white"/>',
         f'<defs><marker id="seta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">'
         f'<path d="M0,0 L10,5 L0,10" fill="none" stroke="{LARANJA}" stroke-width="1.6"/></marker></defs>',
         f'<text x="{W / 2}" y="44" text-anchor="middle" font-size="24" font-weight="700" fill="{VERDE}">Diagrama de Casos de Uso: Freshly</text>',
         f'<rect x="300" y="88" width="790" height="1015" rx="18" fill="none" stroke="{VERDE}" stroke-width="2.5"/>',
         f'<text x="1070" y="118" text-anchor="end" font-size="18" font-weight="700" fill="{VERDE}">Sistema Freshly</text>']

    # associações (linhas sólidas)
    for a, u in ASSOC:
        ax, ay = ATORES[a]
        cx, cy, _ = CASOS[u]
        ox = ax + (30 if ax < cx else -30)
        # a linha chega na ponta da elipse virada para o ator, sem cruzar as outras
        ex, ey = (cx - RX, cy) if ax < cx else (cx + RX, cy)
        p.append(f'<line x1="{ox}" y1="{ay - 10}" x2="{ex:.1f}" y2="{ey:.1f}" stroke="{LINHA}" stroke-width="1.6"/>')

    # include / extend (tracejadas com seta)
    for o, d, tipo in RELACOES:
        ox, oy, _ = CASOS[o]
        dx, dy, _ = CASOS[d]
        x1, y1 = borda_elipse(ox, oy, dx, dy)
        x2, y2 = borda_elipse(dx, dy, ox, oy)
        p.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{LARANJA}" stroke-width="1.8" stroke-dasharray="7 5" marker-end="url(#seta)"/>')
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        dxl = 62 if abs(x2 - x1) < 5 else 0
        p.append(f'<text x="{mx + dxl:.1f}" y="{my - 6:.1f}" text-anchor="middle" font-size="13" fill="{LARANJA}">«{tipo}»</text>')

    # casos de uso
    for cod, (x, y, nome) in CASOS.items():
        p.append(f'<ellipse cx="{x}" cy="{y}" rx="{RX}" ry="{RY}" fill="{VERDE_CLARO}" stroke="{VERDE}" stroke-width="1.8"/>')
        p.append(f'<text x="{x}" y="{y - 6}" text-anchor="middle" font-size="12" font-weight="700" fill="{VERDE}">{cod}</text>')
        p.append(f'<text x="{x}" y="{y + 14}" text-anchor="middle" font-size="15" fill="{TEXTO}">{nome}</text>')

    for nome, (x, y) in ATORES.items():
        p.append(ator(nome, x, y))

    p.append(f'<text x="310" y="1140" font-size="13" fill="#6B706C">Linha cheia: ator usa o caso de uso.  Tracejada «include»: sempre acontece junto.  Tracejada «extend»: opcional, a partir do caso apontado.</text>')
    p.append('</svg>')
    open(saida, 'w', encoding='utf-8').write('\n'.join(p))


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'casos-de-uso.svg')
