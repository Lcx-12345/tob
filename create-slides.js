import PptxGenJS from 'pptxgenjs';

// Create a new presentation
const pptx = new PptxGenJS();

// Set slide size to 16:9 (wide)
pptx.layout = 'LAYOUT_WIDE';

// Set theme fonts
pptx.defineSlideMaster({
  title: { 
    text: 'Sample Presentation',
    fontFace: 'Arial',
    fontSize: 32,
    bold: true,
    color: '333333'
  },
  body: { 
    fontFace: 'Arial',
    fontSize: 18,
    color: '666666'
  }
});

// Slide 1: Title Slide
let slide = pptx.addSlide();
slide.addText('Sample Presentation', {
  x: 0, y: 0, w: '100%', h: '100%',
  align: 'center',
  verticalAlign: 'middle',
  fontSize: 36,
  bold: true
});

// Slide 2: Introduction
slide = pptx.addSlide();
slide.addText('Introduction', {
  x: 0, y: 0, w: '100%', h: 1.5,
  align: 'center',
  fontSize: 28,
  bold: true
});
slide.addText('This is a sample PowerPoint presentation created using PptxGenJS.', {
  x: 1, y: 2, w: '80%', h: 2,
  fontSize: 18
});

// Slide 3: Features
slide = pptx.addSlide();
slide.addText('Features', {
  x: 0, y: 0, w: '100%', h: 1.5,
  align: 'center',
  fontSize: 28,
  bold: true
});
slide.addText('• Easy to use', {
  x: 1, y: 2, w: '80%', h: 0.8,
  fontSize: 18
});
slide.addText('• Customizable', {
  x: 1, y: 2.8, w: '80%', h: 0.8,
  fontSize: 18
});
slide.addText('• Professional quality', {
  x: 1, y: 3.6, w: '80%', h: 0.8,
  fontSize: 18
});

// Slide 4: Conclusion
slide = pptx.addSlide();
slide.addText('Conclusion', {
  x: 0, y: 0, w: '100%', h: 1.5,
  align: 'center',
  fontSize: 28,
  bold: true
});
slide.addText('Thank you for viewing this sample presentation!', {
  x: 0, y: 2, w: '100%', h: 2,
  align: 'center',
  fontSize: 20
});

// Save the presentation
pptx.writeFile({ fileName: 'sample-presentation.pptx' }).then(() => {
  console.log('Presentation created successfully!');
}).catch(err => {
  console.error('Error creating presentation:', err);
});