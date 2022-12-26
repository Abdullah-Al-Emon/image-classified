// const $ = document.querySelector.bind(document);
const append = document.getElementById('image-description')
/**
 * Collection of rectangles defining user generated regions
 */
const rectangles = [];

// DOM elements
const $screenshot = document.getElementById('screenshot');
const $draw = document.getElementById('draw');
const $marquee = document.getElementById('marquee');
const $boxes = document.getElementById('boxes');

// Temp variables
let startX = 0;
let startY = 0;
const marqueeRect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
};

$marquee.classList.add('hide');
document.getElementById('label1').addEventListener('click', function ()
{
    $screenshot.addEventListener('pointerdown', startDrag);
    $boxes.style.stroke = 'yellow'
    $boxes.style.fill = 'white'
    console.log('label1')
})

function startDrag(ev)
{
    // middle button delete rect
    if (ev.button === 1) {
        const rect = hitTest(ev.layerX, ev.layerY);
        if (rect) {
            rectangles.splice(rectangles.indexOf(rect), 1);
            redraw();
        }
        return;
    }
    window.addEventListener('pointerup', stopDrag);
    $screenshot.addEventListener('pointermove', moveDrag);
    $marquee.classList.remove('hide');
    startX = ev.layerX;
    startY = ev.layerY;
    drawRect($marquee, startX, startY, 0, 0);
}

function stopDrag(ev)
{
    $marquee.classList.add('hide');
    window.removeEventListener('pointerup', stopDrag);
    $screenshot.removeEventListener('pointermove', moveDrag);
    if (ev.target === $screenshot && marqueeRect.width && marqueeRect.height) {
        rectangles.push(Object.assign({}, marqueeRect));
        redraw();
    }
}

function moveDrag(ev)
{
    let x = ev.layerX;
    let y = ev.layerY;
    let width = startX - x;
    let height = startY - y;
    if (width < 0) {
        width *= -1;
        x -= width;
    }
    if (height < 0) {
        height *= -1;
        y -= height;
    }
    Object.assign(marqueeRect, { x, y, width, height });
    drawRect($marquee, marqueeRect);
}

function hitTest(x, y)
{
    return rectangles.find(rect => (
        x >= rect.x &&
        y >= rect.y &&
        x <= rect.x + rect.width &&
        y <= rect.y + rect.height
    ));
}

function redraw()
{
    $boxes.innerHTML = '';
    rectangles.forEach((data) =>
    {
        $boxes.appendChild(drawRect(
            document.createElementNS("http://www.w3.org/2000/svg", 'rect'), data
        ));
    });
}
// const div = document.createElement('div');
// div.innerHTML = `
// <span>${data.x}, ${data.y} </span>
// `
// append.appendChild(div)



function drawRect(rect, data)
{
    console.log(data)
    const storage = JSON.stringify(data)
    localStorage.setItem('draw1', storage)
    const { x, y, width, height } = data;
    rect.setAttributeNS(null, 'width', width);
    rect.setAttributeNS(null, 'height', height);
    rect.setAttributeNS(null, 'x', x);
    rect.setAttributeNS(null, 'y', y);
    return rect;
}