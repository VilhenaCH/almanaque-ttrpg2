# Almanaque TTRPG

Plataforma leve de RPG de mesa feita para o celular, por [vilhenach](https://github.com/vilhenach).

Hoje o Almanaque tem o módulo **Cartógrafo**: você **cria o mapa dentro do app** (sem imagens de terceiros, tudo desenhado por código) e depois **joga em cima dele**, com névoa de guerra, luz, régua e vista isométrica. Os mapas não são imagens: cada objeto continua sendo uma peça que dá para pegar e mover.

Sem conta, sem servidor e sem instalar nada por enquanto. Tudo fica salvo no próprio aparelho. A sincronização entre celulares (mesa compartilhada) é o próximo passo, veja `ARQUITETURA.md`.

## Como usar

O botão **Criar | Jogar** fica no topo.

**Criar (Ateliê)** é onde o mapa é construído:

- **Mover**: toque num objeto para escolher, arraste para mover. Dá para girar 90° ou 15°, duplicar, apagar e marcar **Jogadores mexem**. Com **Encaixe na grade** desligado, o objeto vai exatamente onde o dedo solta.
- **Piso**, **Parede** (parede, janela, porta), **Objeto**, **Apagar**, **Régua** e **Luz** (testar a visão dos tokens).

**Jogar (mesa)** é uma cópia do Ateliê para usar em jogo. Mexer nela não estraga o mapa original.

- O **Mestre** mexe em qualquer peça, abre portas, liga e desliga a névoa e adiciona tokens.
- O **Jogador** só tem Mover e Régua: move os próprios tokens e os objetos que o Mestre liberou. A névoa é preta para ele, e tokens marcados **Só o Mestre mexe** somem no escuro.
- Se você mudar o Ateliê depois, aparece um aviso para atualizar a mesa. Pelo menu também dá para trazer a mesa de volta para o Ateliê.

**Vista isométrica**: botão de camadas no canto da tela (vale para os dois modos), com botão para girar a vista. Altura das paredes no menu.

**Levar um mapa para outro aparelho**: Menu → Copiar o mapa como texto → no outro aparelho, Menu → colar → Carregar. Mapas do protótipo antigo (Cartógrafo) também abrem assim.

## Instalar no celular

Abra o endereço do site no Chrome, menu ⋮ → **Instalar app** (ou **Adicionar à tela inicial**). Depois de aberto uma vez com internet, ele abre também sem sinal.

## Publicar pelo celular (GitHub Pages)

1. No GitHub: **+** → **New repository**. Nome: `almanaque-ttrpg`. Marque **Public** e crie.
2. Na página do repositório vazio, toque em **uploading an existing file** → **choose your files** e selecione **todos os 10 arquivos** (os arquivos de dentro da pasta, não a pasta). Toque em **Commit changes**.
3. **Settings** → **Pages** → Source: **Deploy from a branch** → Branch: **main** / **(root)** → **Save**.
4. Espere 1 ou 2 minutos. O endereço deve ser `https://vilhenach.github.io/almanaque-ttrpg/`.

Para atualizar: **Add file** → **Upload files** com os arquivos novos, usando os mesmos nomes (eles substituem os antigos). Com internet, o app sempre pega a versão mais nova; não precisa limpar nada.

## Arquivos

Tudo fica na raiz, sem pastas e sem etapa de build.

| Arquivo | O que é |
|---|---|
| `index.html` | Estrutura da tela e do menu |
| `style.css` | Visual (tema escuro e claro automáticos) |
| `app.js` | Todo o app. Cabeçalho do arquivo lista as seções |
| `sw.js` | Guarda os arquivos para abrir sem internet |
| `manifest.webmanifest` | Dados para instalar como app |
| `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | Ícones |
| `README.md`, `ARQUITETURA.md` | Documentação |

## Privacidade e limites

- Não há conta, cookie de rastreio nem envio de dados. Os mapas ficam no armazenamento do navegador deste aparelho (limpar os dados do site apaga tudo, então use **Copiar o mapa como texto** para guardar uma cópia).
- Mestre e Jogador são, por enquanto, um botão no próprio aparelho. Quando houver mesa compartilhada, o Firebase passa a decidir quem pode o quê.
- Única coisa externa: as fontes do Google Fonts. Sem internet, o app usa a fonte do aparelho.

## Licença

A definir. Enquanto não houver arquivo `LICENSE`, todos os direitos ficam reservados ao autor.
