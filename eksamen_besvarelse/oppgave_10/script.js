class Rectangle {

  constructor(ctx, x_position, width, y_postion, height, color) {
    this.x_position = x_position;
    this.width = width
    this.y_postion = y_postion;
    this.height = height
    this.color = color;
    this.ctx = ctx;

    this.x_velocity = 0
    this.x_direction = 0
    this.y_velocity = 0
    this.y_direction = 0

    this.alive = true
  }

  draw() {
    this.x_position += this.x_velocity * this.x_direction
    this.y_postion += this.y_velocity * this.y_direction
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x_position, this.y_postion, this.width, this.height);
  }
  
  grow(growth_margin){
    this.y_postion -= growth_margin        
    this.x_position -= growth_margin        
    this.width += growth_margin * 2        
    this.height += growth_margin * 2        
  }

  move(x_velocity, x_direction, y_velocity, y_direction){
    this.x_velocity = x_velocity
    this.x_direction = x_direction
    this.y_velocity = y_velocity
    this.y_direction = y_direction
  }

  rectangle_collides_direction(obstacle_lower, obstacle_upper, dir){

    let rectangle_lower, rectangle_upper
    if (dir.toLowerCase() === "x"){
      rectangle_lower = this.x_position
      rectangle_upper = this.x_position + this.width
    }
    else if (dir.toLowerCase() === "y"){
      rectangle_lower = this.y_postion
      rectangle_upper = this.y_postion + this.height
    }

    if( object_collides(rectangle_lower, rectangle_upper, obstacle_lower, obstacle_upper)){
      return true
    }
    return false
  }

  get_values(){
    const x_position = this.x_position
    const y_postion = this.y_postion
    const x_direction = this.x_direction
    const y_direction = this.y_direction
    const width = this.width
    const height = this.height
    const alive = this.alive
    return {x_position, y_postion, x_direction, y_direction, width, height, alive}
  }
}

class Collection_rectangles {

  constructor(){
    this.rectangles = []
  }

  draw_rectangles(){
    this.rectangles.forEach( rectangle => rectangle.draw() )
  }

  add_rectangle(rectangle){
    this.rectangles.push(rectangle)
  }
  
  add_random_rectangle(color, avoid_areas){

    let valid_pos = false

    // creates a possible position for new rectangle
    let x_pos = random_integer_in_range(20, canvas.width - 20)
    let y_pos = random_integer_in_range(20, canvas.height- 20)

    // dimensions of the new possible rectangle
    const obstacle_x1 = x_pos
    const obstacle_x2 = x_pos + 20  
    const obstacle_y1 = y_pos + 20 
    const obstacle_y2 = y_pos

    // avoids endless loop
    let loop_limit = 100

    // checks if the new possible rectangle collides with any existing objects on the canvas
    while (!valid_pos && loop_limit > 0){
      loop_limit -= 1
      valid_pos = true

      for (let i = 0; i < avoid_areas.rectangles.length; i++) {

        const rectangle_x1 =  avoid_areas.rectangles[i].x_position + avoid_areas.rectangles[i].width
        const rectangle_x2 =  avoid_areas.rectangles[i].x_position
        const rectangle_y1 = avoid_areas.rectangles[i].height + avoid_areas.rectangles[i].y_postion
        const rectangle_y2 = avoid_areas.rectangles[i].y_postion
    
        // rectangle hits obstacle
        if ( object_collides(obstacle_y1, obstacle_y2, rectangle_y1, rectangle_y2) && object_collides(obstacle_x1, obstacle_x2, rectangle_x1, rectangle_x2) ){
          // new rectangle would have collided, checks for new possition
          valid_pos = false
          x_pos = random_integer_in_range(20, canvas.width - 20)
          y_pos = random_integer_in_range(20, canvas.height- 20)
        }
      }
    }
  
    // valid possition found, creates new rectangle 
    const rectangle = new Rectangle(ctx, x_pos, 20 , y_pos, 20, color)
    avoid_areas.rectangles.push(rectangle)
    this.rectangles.push(rectangle)
    
    if (loop_limit < 0){
      window.alert("error")
    }


  }


  kill_rectangle(rectangle){
    rectangle.color = create_hsl_expression( 0, 0 , 50 )
    rectangle.alive = false
  }

  add_random_factor(random_factor){
    this.random_factor = random_factor
  }
}


let animation_id 
var canvas, ctx
let lives
let troll_speed = 5
let invinsible = false


window.onload = winInit;
function winInit() {

  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  
  const score_element = document.getElementById("score_placeholder")


  const all_objects = new Collection_rectangles()

  
  
  const troll_color = create_hsl_expression( 100 , 75 , 50 )
  const troll = new Rectangle(ctx, canvas.width/2, 20, canvas.height/2, 20, troll_color)
  all_objects.add_rectangle(troll)
  
  
  const mat_biter = new Collection_rectangles()
  mat_color = create_hsl_expression( 60 , 75 , 50 )
  mat_biter.add_random_rectangle(mat_color, all_objects)
  mat_biter.add_random_rectangle(mat_color, all_objects)
  mat_biter.add_random_rectangle(mat_color, all_objects)

  animation_id = setInterval( function () { draw_troll_game(canvas, troll, mat_biter, score_element, all_objects) }, 1000 / 50);

  document.addEventListener("keydown", function(event){ rectangle_key_handler(event, troll, troll_speed, troll_speed) })
  
}

//Creates balls, draws background and detects ball collision
function draw_troll_game(canvas, troll, food, score_element, obstacles) {
  draw_background(canvas, "black")
  troll.draw()
  draw_colliding_rectangles(canvas, food, troll, obstacles)
  text_to_element(food.rectangles.length - 3, score_element)
}

// handles key inputs and in this case changes player speed accordingly
// is made to be general, for my use case it is not utilized to its full potential
function rectangle_key_handler(event, rectangle, x_speed, y_speed){

  rectangle_info = rectangle.get_values()
  const rectangle_x_direction = rectangle_info.x_direction
  const rectangle_y_direction = rectangle_info.y_direction

  if (event.type === "keydown"){

    if (event.key === "ArrowLeft"){
      rectangle.move(x_speed, -1, 0, 0)
    }
    else if (event.key === "ArrowRight"){
      rectangle.move(x_speed, 1, 0, 0)
    }
    else if (event.key === "ArrowUp"){
      rectangle.move(0, 0, y_speed, -1)
    }
    else if (event.key === "ArrowDown"){
      rectangle.move(0, 0, y_speed, 1)
    }
  }

  if (event.type === "keyup") {

    if (event.key === "ArrowLeft" && rectangle_x_direction !== 1){
      rectangle.move(0, 0, 0, 0)
    }
    else if (event.key === "ArrowRight" && rectangle_x_direction !== -1){
      rectangle.move(0, 0, 0, 0)
    }
    else if (event.key === "ArrowUp" && rectangle_y_direction !== 1){
      rectangle.move(0, 0, 0, 0)
    }
    else if (event.key === "ArrowDown" && rectangle_y_direction !== -1){
      rectangle.move(0, 0, 0, 0)
    }
  }
}

function draw_colliding_rectangles(canvas, rectangle_array, player, obstacles){

  // gets player position and dimensions
  player_info = player.get_values()
  const player_x1 = player_info.x_position
  const player_x2 = player_info.x_position + player_info.width  
  const player_y1 = player_info.height + player_info.y_postion
  const player_y2 = player_info.y_postion

  // draws all rectangles to their new position
  rectangle_array.draw_rectangles()
  
  // checks if any of the newly drawn rectangles collide with the player, or
  // if the player collides with the obstacles
  for (let i = 0; i < rectangle_array.rectangles.length; i++) {

    // gets rectangle dimensions
    const rectangle_x1 =  rectangle_array.rectangles[i].x_position + rectangle_array.rectangles[i].width
    const rectangle_x2 =  rectangle_array.rectangles[i].x_position
    const rectangle_y1 = rectangle_array.rectangles[i].height + rectangle_array.rectangles[i].y_postion
    const rectangle_y2 = rectangle_array.rectangles[i].y_postion

    // player hits food/obstacle
    if ( object_collides(player_y1, player_y2, rectangle_y1, rectangle_y2) && object_collides(player_x1, player_x2, rectangle_x1, rectangle_x2) ){
      if (rectangle_array.rectangles[i].alive){

        rectangle_array.kill_rectangle(rectangle_array.rectangles[i])
        rectangle_array.add_random_rectangle(mat_color, obstacles)
        troll_speed += 0.3
      
        // Denne måten å gjøre det på er ikke veldig generel, men
        // jeg fant ikke en bedre måte med den tiden jeg hadde.
        // Dette fører til at man kan passere gjennom hinder om man spiser en
        // matbit rett før, som ikke er meningen
        setTimeout(become_invinsible, 1)
        setTimeout(stop_invinsible, 300)
      }
      // death
      else if (!rectangle_array.rectangles[i].alive && invinsible == false){
        clearInterval(animation_id)
        rectangle_array.rectangles[i].move(0, 0, 0, 0)
        const random_rectangle_id = random_integer_in_range(0, rectangle_array.rectangles.length)
        death_drawing_rectangle(canvas, rectangle_array.rectangles[random_rectangle_id])   
      }
    }
    // player out of canvas width
    if ( player_x1 < 0 || player_x2 > canvas.width){
      clearInterval(animation_id)
      rectangle_array.rectangles[i].move(0, 0, 0, 0)
      const random_rectangle_id = random_integer_in_range(0, rectangle_array.rectangles.length)
      death_drawing_rectangle(canvas, rectangle_array.rectangles[random_rectangle_id])    
    }
    
    // player out of canvas height
    if (player_y2 < 0 || player_y1 > canvas.height){
      clearInterval(animation_id)
      rectangle_array.rectangles[i].move(0, 0, 0, 0)
      const random_rectangle_id = random_integer_in_range(0, rectangle_array.rectangles.length)
      death_drawing_rectangle(canvas, rectangle_array.rectangles[random_rectangle_id])
    }
  }
}

function become_invinsible() {
  invinsible = true
}

function stop_invinsible() {
  invinsible = false
}

function death_drawing_rectangle(canvas, rectangle){

  growth_number = 1
  const grow_rectangle_interval_id = setInterval( function() {

    growth_number *= 1.05
    rectangle.grow(growth_number)
    rectangle.draw()
    //the growing rectangle fills the canvas
    if (rectangle.width > canvas.width*2.5 && rectangle.height > canvas.height* 2.5 ){
      
      clearInterval(grow_rectangle_interval_id)
      let i = 0
      const death_text_interval_id = setInterval( function() {

        i += 1
        const color = create_hsl_expression( i*3 , 75 , 50 )
        const text_height = largest_font_size(canvas, "You Are Dead!", "Monospace")
        const vertical_space = Math.ceil(canvas.height / text_height)
        fill_largest_font_centered(canvas, "You Are Dead!", "monospace", text_height*(i%vertical_space), color)
      }, 1000/50)
    }
  }, 1000/50)
}
