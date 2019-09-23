const current = figma.currentPage;
// 2. Grab current selection (only first one if more nodes are selected)
const selected = current.selection["0"];

// 1. Show Plugin UI
figma.showUI(__html__, { width: 240, height: 400 });
// 3. Send data to plugin UI
figma.ui.postMessage({
    "objectWidth": selected.width,
    "objectHeight": selected.height,
    "objectStroke": selected.strokeWeight,
    "objectRadius": selected.cornerRadius,
});
// 4. Receive data from plugin UI
figma.ui.onmessage = msg => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === 'resizeWidth' === true) {
        selected.resize(msg.width, msg.height * msg.ratioWidth);
        selected.strokeWeight = msg.stroke * msg.ratioWidth;
        selected.cornerRadius = msg.radius * msg.ratioWidth;
    }
    else if (msg.type === 'resizeHeight') {
        selected.resize(msg.width * msg.ratioHeight, msg.height);
        selected.strokeWeight = msg.stroke * msg.ratioHeight;
        selected.cornerRadius = msg.radius * msg.ratioHeight;
    }
};
