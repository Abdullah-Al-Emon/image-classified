

/**
 * Collection of rectangles defining user generated regions
 */
const rectangless = [];

// DOM elements
// const $screenshot = $('#screenshot');
const $screen = document.getElementById('screenshot');
const $dra = document.getElementById('dra');
const $marq = document.getElementById('marq');
const $box = document.getElementById('box');

// Temp variables
let startXs = 0;
let startYs = 0;
const marqueeRects = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
};

$marq.classList.add('hide');
document.getElementById('label2').addEventListener('click', function(){
    $screen.addEventListener('pointerdown', startDrags);
    $box.style.stroke = 'red'
    $box.style.fill = 'white'
    console.log('label2')
})

function startDrags(ev)
{
    // middle button delete rect
    if (ev.button === 1) {
        const rect = hitTests(ev.layerX, ev.layerY);
        if (rect) {
            rectangless.splice(rectangless.indexOf(rect), 1);
            redraws();
        }
        return;
    }
    window.addEventListener('pointerup', stopDrags);
    $screen.addEventListener('pointermove', moveDrags);
    $marq.classList.remove('hide');
    startXs = ev.layerX;
    startYs = ev.layerY;
    drawRects($marq, startXs, startYs, 0, 0);
}

function stopDrags(ev)
{
    $marq.classList.add('hide');
    window.removeEventListener('pointerup', stopDrags);
    $screenshot.removeEventListener('pointermove', moveDrags);
    if (ev.target === $screen && marqueeRects.width && marqueeRects.height) {
        rectangless.push(Object.assign({}, marqueeRects));
        redraws();
    }
}

function moveDrags(ev)
{
    let x = ev.layerX;
    let y = ev.layerY;
    let width = startXs - x;
    let height = startYs - y;
    if (width < 0) {
        width *= -1;
        x -= width;
    }
    if (height < 0) {
        height *= -1;
        y -= height;
    }
    Object.assign(marqueeRects, { x, y, width, height });
    drawRects($marq, marqueeRects);
}

function hitTests(x, y)
{
    return rectangless.find(rect => (
        x >= rect.x &&
        y >= rect.y &&
        x <= rect.x + rect.width &&
        y <= rect.y + rect.height
    ));
}

function redraws()
{
    $box.innerHTML = '';
    rectangless.forEach((data) =>
    {
        $box.appendChild(drawRects(
            document.createElementNS("http://www.w3.org/2000/svg", 'rect'), data
        ));
    });
}

function drawRects(rect, data)
{
    const { x, y, width, height } = data;
    rect.setAttributeNS(null, 'width', width);
    rect.setAttributeNS(null, 'height', height);
    rect.setAttributeNS(null, 'x', x);
    rect.setAttributeNS(null, 'y', y);
    return rect;
}