# Arquitetura do Almanaque TTRPG

Versão do app: 0.1.0. Este documento descreve o que existe hoje e o plano para a mesa compartilhada. O que é plano está marcado como **(plano)**.

## Princípios

1. **Leve**: arquivos planos, JavaScript puro, sem framework e sem build. Dá para editar e subir pelo celular.
2. **Sem imagens de terceiros**: pisos e objetos são desenhados por código (canvas). Não há créditos a dar nem arquivos pesados.
3. **O mapa não é imagem**: é dado (pisos, bordas, objetos, tokens). Por isso tudo pode ser movido em jogo e a vista isométrica é só outra projeção do mesmo dado.
4. **Funciona sem internet**; a nuvem entra só para sincronizar a mesa **(plano)**.

## Arquivos

`index.html` (estrutura) · `style.css` · `app.js` (tudo) · `sw.js` (uso sem internet) · `manifest.webmanifest` + ícones (instalar como app).

`app.js` tem uma função única com estas seções, nesta ordem: ícones · texturas de piso · volumes isométricos · modelo (Ateliê e mesa) · câmera e luz · desenho · operações · toque · interface e início.

## Modelo de dados

Cada mapa (`map`) tem:

| Campo | Significado |
|---|---|
| `w`, `h` | tamanho em quadrados |
| `F` | `Uint8Array` com o piso de cada quadrado (0 = vazio, 1 a 10 = tipos de piso) |
| `walls` | bordas entre quadrados: chave `h x,y` (horizontal) ou `v x,y` (vertical), valor 1 parede, 2 porta fechada, 3 porta aberta, 4 janela |
| `objects` | `{ id, k, x, y, a, livre }`: tipo, centro (em quadrados, aceita meio quadrado), ângulo em graus, se jogadores podem mexer |
| `tokens` | `{ id, label, color, x, y, mestre }`: `mestre` = só o Mestre mexe e some no escuro para jogadores |
| `unit`, `diag` | unidade da régua e regra de diagonal (linha reta, 1 quadrado, ou alternando 1 e 2) |
| `grid`, `fog`, `range`, `torch` | grade visível, névoa ligada, alcance da visão dos tokens, tochas acendem |

Texto do mapa (`ser`/`des`): JSON `{"v":2, ...}` com o piso em base 36. Também lê `v:1` do protótipo antigo (giros em múltiplos de 90° viram graus).

### Ateliê e mesa

Existem dois mapas: `D.atelie` (onde se constrói) e `D.mesa` (cópia para jogar). Cada um tem a própria pilha de desfazer (até 120 passos). `D.rev` conta mudanças no Ateliê e `D.mrev` guarda a revisão que foi enviada à mesa; quando diferem, o Mestre vê o aviso de atualização. Objetos e tokens têm `id` estável, o que vai permitir sincronizar só o que mudou **(plano)**.

### Papéis

`mode` (`criar` ou `jogar`) e `S.role` (`mestre` ou `jogador`). `isMaster()` vale em Criar e para o Mestre em Jogar. As permissões ficam em `canMoveObj`/`canMoveTok` e na lista de ferramentas de cada papel (`toolset()`).

## Câmera e vista isométrica

Uma câmera só (`cam`: centro, zoom, `iso`, `rot`). A matriz `mat()` leva o chão (x, y) à tela; na vista de cima é só zoom e deslocamento, na isométrica é um losango 2:1 girado em passos de 90°. `P(x, y, h)` projeta com altura, `toW(sx, sy)` volta para o chão. Todas as ferramentas usam `toW`, por isso funcionam nas duas vistas. Na isométrica, paredes e objetos viram prismas ordenados por profundidade, fichas viram peões e o toque num objeto usa o contorno projetado dele.

## Visão, névoa e luz

Cada token (exceto os do Mestre) e cada tocha/fogueira é uma luz. O polígono de visão sai de raios contra as paredes e portas fechadas (`visPoly`); janelas e portas abertas deixam a luz passar. O resultado é guardado em cache e só recalculado quando uma parede, uma luz ou um alcance muda. A névoa é desenhada num canvas à parte; para o Jogador ela é opaca. Na isométrica o recorte da luz é repetido em várias alturas para a luz "subir" pelas paredes e objetos.

Limites conhecidos: a névoa não guarda memória do que já foi visto, e na isométrica o recorte cobre até cerca de 1,2 quadrado de altura.

## Guardar dados

`localStorage`: `almanaque:dados` (Ateliê, mesa e contadores de revisão) e `almanaque:ui` (modo, papel, vista, encaixe). O botão **Copiar o mapa como texto** é o backup do usuário.

## Uso sem internet

`sw.js` usa "rede primeiro": com internet pega sempre os arquivos novos; sem internet abre a última cópia. Não precisa trocar nada no `sw.js` a cada versão. Para mostrar a versão nova, basta subir os arquivos. O número da versão fica em `VERSAO`, no começo do `app.js`.

## Mesa compartilhada com Firebase **(plano)**

Projeto Firebase separado do Tau Volantis, no plano gratuito (Spark), usando o Realtime Database e login anônimo.

Limites do plano gratuito do Realtime Database (confira antes de lançar, podem mudar): [100 conexões simultâneas, 1 GB guardado e 10 GB baixados por mês](https://firebase.google.com/pricing?hl=pt-b), com [limites técnicos como 16 MB por escrita pelo SDK e 32 níveis de profundidade](https://firebase.google.com/docs/database/usage/limits?hl=en). GitHub Pages permite [site de até 1 GB e cerca de 100 GB de banda por mês](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

Como a mesa só troca posições, o consumo esperado é muito abaixo disso. Cuidados: nunca guardar imagens no banco e usar `onDisconnect` para liberar conexões.

Estrutura proposta:

```
/salas/{codigo}/meta        { nome, mestreUid, criadaEm }
/salas/{codigo}/mapa        mapa inteiro (ser(D.mesa)), escrito só pelo Mestre
/salas/{codigo}/tokens/{id} { x, y }          Mestre; Jogador só nos próprios
/salas/{codigo}/objetos/{id}{ x, y, a }       Mestre; Jogador só se "livre"
/salas/{codigo}/portas/{k}  1 | 2 | 3         só o Mestre
/salas/{codigo}/config      { fog, range, torch }   só o Mestre
```

Regras, em resumo: leitura para quem está autenticado na sala; escrita em `meta`, `mapa`, `portas` e `config` só quando `auth.uid` for o `mestreUid`; escrita em `tokens/{id}` e `objetos/{id}` pelo Mestre, ou pelo jogador dono do token / quando `livre` for verdadeiro.

Pontos em aberto: como o Mestre recupera a sala se trocar de celular (uma chave guardada pelo próprio Mestre), tamanho do código da sala e como expirar salas antigas.

## Passos seguintes

1. **0.2**: mesa compartilhada (sala por código, Mestre e Jogador de verdade, posições ao vivo).
2. **0.3**: pacotes de imagens livres (por exemplo CC0) como opção, pintura manual da névoa e memória do que já foi explorado.
3. **0.4**: fichas e regras dos sistemas das campanhas, integradas ao mapa.
