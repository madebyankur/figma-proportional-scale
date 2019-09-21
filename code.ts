// 1. Show Plugin UI
figma.showUI(__html__, {width: 240, height: 400 });

// 2. Grab current selection (only first one if more nodes are selected)
const objectWidth = figma.currentPage.selection["0"].width;
const objectHeight = figma.currentPage.selection["0"].height;
const objectStroke = figma.currentPage.selection["0"].strokeWeight;

// 3. Send data to plugin UI
figma.ui.postMessage({
  "objectWidth": objectWidth,
  "objectHeight": objectHeight,
  "objectStroke": objectStroke
});

// 4. Receive data from plugin UI
figma.ui.onmessage = msg => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'resizeWidth') {
    figma.currentPage.selection["0"].resize(msg.width, msg.height * msg.ratioWidth);
    figma.currentPage.selection["0"].strokeWeight = msg.stroke * msg.ratioWidth
  } else if (msg.type === 'resizeHeight') {
    figma.currentPage.selection["0"].resize(msg.width * msg.ratioHeight, msg.height);
    figma.currentPage.selection["0"].strokeWeight = msg.stroke * msg.ratioHeight
  }
}