var canvas1, ctx;
window.onload = winInit;

function winInit() {
  canvas1 = document.getElementById("canvas1");
  ctx = canvas1.getContext("2d");
  
  let main_csv;

  const overwrite_csv_button = document.getElementById("csv_overwrite_button");
  const inputElement = document.getElementById("valgt_fil");

  inputElement.addEventListener("change", function () {});

  // reads the file and replaces the main_csv with the read file
  overwrite_csv_button.addEventListener("click", function () {
    const file = inputElement.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const fileContents = event.target.result;
      main_csv = fileContents;
      main(main_csv);
    };

    reader.readAsText(file);
  });
}

async function main(csv) {
  const stored_csv = store_csv(csv, "§");


  const apps = stored_csv[0]
  const categories = stored_csv[1]
  const ratings = stored_csv[2]
  const installs = stored_csv[5]

  // When i use the shift() method, it is because it removes the first value in
  // an array, which inturn removes the title, which in my case is irrelevant at this stage

  apps.shift()
  categories.shift()
  ratings.shift()
  installs.shift()

  // !Snippet shows most common categories!
  let three_most_frequent_categories = get_n_frequency_elements(categories, 3, true)
  draw_bar_chart_print(three_most_frequent_categories[0], three_most_frequent_categories[1], "Categories", "Number of apps", "canvas1", "Most frequent categories")

  // !Snippet shows average ratings for the most common categories
  string_to_float_array(ratings)  
  let average_num_pair_values_ratings = get_average_num_values_pair_arrays(categories, ratings)

  let average_ratings = []
  for (let i = 0; i < three_most_frequent_categories[0].length; i++) {
    let index = average_num_pair_values_ratings[0].indexOf(three_most_frequent_categories[0][i])
    let average_value = average_num_pair_values_ratings[1][index]
    average_ratings.push(average_value)
  }

  draw_bar_chart_print(three_most_frequent_categories[0], average_ratings, "Categories", "ratings", "canvas2", "Average ratings categories")

  // !Snippet shows average installs for each category
  remove_specific_character(installs, ",")
  string_to_int_array(installs)  
  // gets average installs for each category
  let average_num_pair_values_installs = get_average_num_values_pair_arrays(categories, installs)
  let averages = []

  // finds the average installs for the three most frequent installs, adds to the averages array
  for (let i = 0; i < three_most_frequent_categories[0].length; i++) {
    let index = average_num_pair_values_installs[0].indexOf(three_most_frequent_categories[0][i])
    // converts to millions
    let average_value = average_num_pair_values_installs[1][index]/1000000
    averages.push(average_value)
  }

  draw_bar_chart_print(three_most_frequent_categories[0], average_ratings, "Categories", "Average installs(millions)", "canvas3", "Average installs categories")

  // Oppgave b
  // !Snippet shows three most popular apps for each category
  
  // finds 1000 most installed apps
  let most_installed_apps = get_n_extreme_values(apps, installs, 1000, true)

  // arrays for storing the most frequent app, and its category, and number of installations and category
  let category_frequeny_app = []
  let category_frequeny = []

  // runs for the three most popular categories
  for (let i = 0; i < three_most_frequent_categories[0].length; i++) {
    
    // adds the category to each of the arrays
    category_frequeny_app.push(three_most_frequent_categories[0][i])
    category_frequeny.push(three_most_frequent_categories[0][i])

    // limits how many times can be pushed to the category_frequeny arrays
    let times_pushed = 0
    let j = 0

    while (times_pushed < 3){

      // finds index of most installed app
      let most_installed_app_index = apps.indexOf(most_installed_apps[0][j])
      // finds the category of this highly installed app
      let most_frequent_app_category = (categories[most_installed_app_index])
      // the how many have installed this highly installed app
      let frequency = most_installed_apps[1][j]

      // checks if the highly installed app is in the category we are looking for
      // if it is, adds to arrays
      if (most_frequent_app_category === three_most_frequent_categories[0][i]){
        category_frequeny_app.push(most_installed_apps[0][j])
        category_frequeny.push(frequency/1000000)
        times_pushed += 1
      }
      // increments
      j += 1
    }

  }
  print("\n")
  print("Three most popular apps for three most popular categories")
  print_two_arrays(category_frequeny_app, category_frequeny, "Categories and apps", "Installs(Millions)")
}

function draw_bar_chart_print(x_values, y_values, x_axis, y_axis, canvas, print_title){
  draw_bar_chart( x_values, y_values, x_axis, y_axis, canvas );
  print(print_title)
  print_two_arrays(x_values, y_values, x_axis, y_axis)
  print("\n")
}

function print_two_arrays(array1, array2, title1, title2){
  let string = title1 + " | " + title2
  for (let i = 0; i < array1.length; i++) {
    if (array2[i]){
      string += "\n" + array1[i] + ": " + array2[i]
    }    
  }
  print(string)
}

function remove_specific_character(array, character) {
  // interates an entire array and removes a specific character
  // from every string in the array
  for (let i = 0; i < array.length; i++) {
    array[i] = array[i].replace(new RegExp(character, 'g'), '');
  }
}

function draw_bar_chart(x_values, y_values, x_axis, y_axis, canvas) {
  tegnBrukCanvas(canvas)
  tegnBrukBakgrunn("white");
  tegnBrukXY(-1, x_values.length, 0, Math.max(...y_values) * 1.2);

  for (let i = 0; i < x_values.length; i++) {
    tegnFyltRektangel(i - 0.25, 0, 0.5, y_values[i], "black");
    tegnTekst( x_values[i], i-0.2, -Math.max(...y_values) * 0.1, "red", 0, "left", 20, "Calibri", "bottom" );
  }
  tegnAkser(x_axis, y_axis, 0, 1, false, true, true);
}

function get_average_num_values_pair_arrays(name_values, num_values) {

  //creates a set of the name values
  const unique_name_values_set = new Set(name_values);
  const unique_name_values = Array.from(unique_name_values_set);

  //frequency array stores how many times we add to value array
  //value array stores the sum of all the unique num values
  const frequency_array = new Array(unique_name_values.length).fill(0);
  const value_array = new Array(unique_name_values.length).fill(0);
  const average_array = [];

  //loop through the name_values array and update the corresponding value_array and frequency_array elements
  for (let i = 0; i < name_values.length; i++) {
    //gets the index of the name value,
    const index = unique_name_values.indexOf(name_values[i]);
    //add the corresponding numerical value to the value_array at the correct index
    value_array[index] += parseFloat(num_values[i]);
    //increment the corresponding frequency_array element at the correct index
    frequency_array[index] += 1;
  }

  //loop through the frequency_array and compute the average value for each unique name value
  for (let i = 0; i < frequency_array.length; i++) {
    //divide the value_array element by the frequency_array element to get the average numerical value
    const average_value = parseFloat( (value_array[i] / frequency_array[i]).toFixed(2) );
    average_array.push(average_value);
  }

  return [unique_name_values, average_array];
}

//takes an array, a number value and a boolean
//finds the n-most-or-least frequent elements in the array, easy to use.
function get_n_frequency_elements(array, n, is_most_frequent) {
  //the result of this means that each element in sorted_set will have a corresponding
  //frequency of itself in the frequency array (same index)
  const sorted_set = get_unique_values_sorted(array);
  const frequency_array = create_sorted_frequency_array(array);
  return get_n_extreme_values(sorted_set, frequency_array, n, is_most_frequent)
}

function get_n_extreme_values(name_array, num_array, n, is_largest) { 
  const n_num_values = [];
  const n_name_values = [];

  // creates shallow copies, instead of copying by reference,
  // this is because the splice operator is later used, which
  // could interfer with the result a later time
  let name_array_copy = [...name_array];
  let num_array_copy = [...num_array];

  for (let i = 0; i < n; i++) {

    let extreme_value = get_extreme_value_index(num_array_copy, is_largest)

    const index_extreme_value = num_array_copy.indexOf(extreme_value);
    n_num_values.push(num_array_copy[index_extreme_value]);
    n_name_values.push(name_array_copy[index_extreme_value]);
    num_array_copy.splice(index_extreme_value, 1);
    name_array_copy.splice(index_extreme_value, 1);
  }
  return [n_name_values, n_num_values];
}

//returns an array with the frequency of each element of the given array.
function create_sorted_frequency_array(array) {

  // cheks if all values in array are numbers
  // if array doesn't consist of numbers, normal sort
  // else, number sort
  if (array.some(isNaN)){
    array.sort()
  }
  else{
    sort_ascending(array);
  }

  const frequency_array = [];
  let frequency = 0;

  // creates an array of the frequency of each element in the array given as a parameter
  for (let i = 0; i < array.length; i++) {
    frequency += 1;
    if (array[i] !== array[i + 1]) {
      frequency_array.push(frequency);
      frequency = 0;
    }
  }
  return frequency_array;
}

function string_to_int_array(array) {
  for (let i = 0; i < array.length; i++) {
    array[i] = parseInt(array[i]);
  }
  return array;
}

function string_to_float_array(array){
  for (let i = 0; i < array.length; i++) {
    array[i] = parseFloat(array[i]);
  }
  return array;
}

function get_extreme_value_index(array, is_largest){
  let index
  if (is_largest){
    index = Math.max(...array)
  }
  else if (!is_largest){
    index = Math.min(...array)
  }
  return index
}

function get_unique_values_sorted(array) {

  // cheks if all values in array are numbers
  // if array doesn't consist of numbers, normal sort
  // else, number sort
  if (array.some(isNaN)){
    array.sort()
  }
  else{
    sort_ascending(array);
  }

  let unique_values = new Set(array);
  unique_values = Array.from(unique_values);
  return unique_values;
}

function sort_ascending(array) {
  array.sort(function (a, b) {
    return a - b;
  });
  return array;
}

function store_csv(csv, seperator) {
  //create a 2d array and store each column in its array
  csv = csv.split("\r\n");
  const name_values = csv[0].split(seperator);

  for (let i = 0; i < csv.length; i++) {
    csv[i] = csv[i].split(seperator);
  }

  const array = new Array();

  for (let i = 0; i < name_values.length; i++) {
    array[i] = new Array(name_values.length);
    for (let j = 0; j < csv.length; j++) {
      array[i][j] = csv[j][i];
    }
  }
  return array;
}

async function read_csv(csv_file, callback, seperator) {
  const filinnhold = await lastInn(csv_file);
  return callback(filinnhold, seperator);
}

function lastInn(file) {
  return fetch(file).then((response) => response.text());
}