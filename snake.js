var canvas = null,
    ctx = null,
    snake = new Array(),
    tam = 20,
    tecla = null,
    ant = null,
    comida = null,
    finJuego = false,
    volverJugar = false,
    boton = null,
    puntuacion = 0;

function inicializar()
{
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    resize();

    comida = new Rectangle(80, 80, tam, tam);

    snake.push(new Rectangle(canvas.width / 2, canvas.height / 2, tam, tam));
    snake.push(new Rectangle((canvas.width / 2) + tam, canvas.height / 2, tam, tam));
    snake.push(new Rectangle((canvas.width / 2) + 2 * tam, canvas.height / 2, tam, tam));

    document.addEventListener("keypress", mover, false);
    window.addEventListener("resize", resize, false);

    repaint();
    run();
}

function repaint()
{
    window.requestAnimationFrame(repaint);
    paint(ctx);
}

function run()
{
    setTimeout(run, 100);
    act();
}

function paint(ctx)
{
    var fondo = new Image();
    fondo.src = "imagenes/fondo2.png";

    var snakeImagen = new Image();
    snakeImagen.src = "imagenes/snake.png";

    var comidaImagen = new Image();
    comidaImagen.src = "imagenes/comida.png";

    ctx.drawImage(fondo, 0, 0);

    ctx.drawImage(comidaImagen, comida.x, comida.y);
    for(let i = 0; i < snake.length; i++)
    {
        ctx.drawImage(snakeImagen, snake[i].x, snake[i].y)
    }
    ctx.strokeText("Puntuacion: " + puntuacion,0,10);
    if(localStorage.puntuacion)
    {
        if(puntuacion > localStorage.puntuacion)
        {
            localStorage.puntuacion = puntuacion;
        }
    }
    else
    {
        localStorage.puntuacion = 0;
    }
    if(localStorage.puntuacion)
    {
        var maxPuntuacion = localStorage.puntuacion;
        ctx.strokeText("Puntuacion maxima:  " + maxPuntuacion,0,20);
    }

    if(finJuego)
    {
        ctx.strokeText("wsda para jugar",0,30);
    }

    else
    {
        ctx.strokeText("",0,30, 500);
    }
}

function act()
{
    var nuevaX = snake[0].x,
        nuevaY = snake[0].y;
    if(tecla !== null)
    {
        finJuego = false;
    }

    if(tecla === "w" && ant !== "s")
    {
        ant = "w";
        nuevaY -= tam;
    }
    else if(tecla === "s" && ant !== "w")
    {
        ant = "s";
        nuevaY += tam;
    }
    else if(tecla === "a" && ant !== "d")
    {
        ant = "a";
        nuevaX -= tam;
    }
    else if(tecla === "d" && ant !== "a")
    {
        ant = "d";
        nuevaX += tam;
    }
    else
    {
        tecla = ant;
    }

    nuevaCabeza = new Rectangle(nuevaX, nuevaY, tam, tam);

    if(nuevaCabeza.x > canvas.width - tam || nuevaCabeza.x < 0 ||
       nuevaCabeza.y > canvas.height - tam ||nuevaCabeza.y < 0 ||
       seCome())
    {
        finJuego = true;
        reset();
    }
    else if(nuevaCabeza.choque(comida))
    {
        snake.unshift(new Rectangle(nuevaX, nuevaY, tam, tam));
        do{
            comida.x = random(canvas.width / tam - 1) * tam;
            comida.y = random(canvas.height / tam - 1) * tam;
        }while(nuevaCabeza.choque(comida));
        puntuacion += 100;
    }
    else
    {
        snake.unshift(new Rectangle(nuevaX, nuevaY, tam, tam));
        snake.pop();
    }
}

function reset()
{
    comida = new Rectangle(80, 80, tam, tam);
    tecla = null;
    ant = null;
    puntuacion = 0;
    snake.length = 0;
    finJuego = true;
    snake.push(new Rectangle(canvas.width / 2, canvas.height / 2, tam, tam));
    snake.push(new Rectangle((canvas.width / 2) + tam, canvas.height / 2, tam, tam));
    snake.push(new Rectangle((canvas.width / 2) + 2 * tam, canvas.height / 2, tam, tam));
}

function random(max)
{
    return Math.floor(Math.random() * max);
}

function seCome()
{
    for(let i = 1; i < snake.length; i++)
    {
        if(nuevaCabeza.choque(snake[i]))
        {
            return true;
        }
    }
    return false;
}


function mover(event)
{
    var evento = event || window.event;
    var codigo = evento.charCode || evento.keyCode;
    tecla = String.fromCharCode(codigo).toLocaleLowerCase();
}

function resize()
{
    var w = window.innerWidth / canvas.width;
    var h = window.innerHeight / canvas.height;
    var scale = Math.min(h,w);
    canvas.style.width = (canvas.width * scale) + 'px';
    canvas.style.height = (canvas.height * scale) + 'px';
}

function Rectangle(x, y, width, height)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.choque = function(rect)
        {
            return (this.x < rect.x + rect.width &&
            this.x + this.width > rect.x &&
            this.y < rect.y + rect.height &&
            this.y + this.height > rect.y);
        }

    this.fill = function(ctx)
        {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
}

window.addEventListener("load", inicializar, false);
