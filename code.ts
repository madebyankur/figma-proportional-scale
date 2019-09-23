const current = figma.currentPage


// 2. Grab current selection (only first one if more nodes are selected)
const selected = current.selection["0"]
const objectShadowRadius = selected.effects.forEach(function(item, index, array){}).radius
const objectShadowOffsetX = selected.effects.forEach(function(item, index, array){}).offset.x
const objectShadowOffsetY = selected.effects.forEach(function(item, index, array){}).offset.y

function hasShadow(selected) {
  return !(!selected.effects.forEach(function(item, index, array){}) || selected.effects.forEach(function(item, index, array){}).length === 0)
}

// 1. Show Plugin UI
  figma.showUI(__html__, {width: 240, height: 400 })

  // 3. Send data to plugin UI
  figma.ui.postMessage({
    "objectWidth": selected.width,
    "objectHeight": selected.height,
    "objectStroke": selected.strokeWeight,
    "objectRadius": selected.cornerRadius,
    "objectShadowRadius": selected.objectShadowRadius,
    "objectShadowOffsetX": selected.objectShadowOffsetX,
    "objectShadowOffsetY": selected.objectShadowOffsetY,
  })

  // 4. Receive data from plugin UI
  figma.ui.onmessage = msg => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === 'resizeWidth' === true) {
      selected.resize(msg.width, msg.height * msg.ratioWidth)
      selected.strokeWeight = msg.stroke * msg.ratioWidth
      selected.cornerRadius = msg.radius * msg.ratioWidth
      figma.currentPage.selection["0"].effects["0"].radius = msg.objectShadowRadius * msg.ratioWidth
      selected.effects["0"].offset.x = msg.objectShadowOffsetX * msg.ratioWidth
      selected.effects["0"].offset.y = msg.objectShadowOffsetY * msg.ratioWidth
    } else if (msg.type === 'resizeHeight') {
      selected.resize(msg.width * msg.ratioHeight, msg.height)
      selected.strokeWeight = msg.stroke * msg.ratioHeight
      selected.cornerRadius = msg.radius * msg.ratioHeight
    }
  }