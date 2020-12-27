# Plotter-GLSL-Shader
 A WebGL shader pair written in GLSL/JS, with the following features:
 
 	- a 3D raveling and unraveling transformation on the model, based on a time var to vary the trigonometric angle operations and apparent rotation speed as it deforms
	- discard operations on model-view coordinates with a large number of subdivisions to create the illusion of a dot matrix composing the 3D model, thus giving an illusion of partial transparency as the object bends and is rotated, w/ use of varyings
	- an iridescent, full spectrum color palette created by RGB w/ diffuse reflection w/ use of varyings
	- specular and ambient light ratios to enhance and define polygonal variance
	- rotation of the emitting light source
 
 Demo with sample mesh:
 
 [![Demo](demo.gif)](https://tinyurl.com/y8r6c6fe)
