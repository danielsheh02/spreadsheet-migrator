// Pull in Laravel Mix
const mix = require('laravel-mix');

// Configure what it does
mix
    .setPublicPath('../static/excel_parser/js')


    // .copy('src/static', 'dist')


    .ts('src/index.tsx', 'index.js')
    .react();