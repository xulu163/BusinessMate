Sync CSV parser.

# Install 

    npm install csv2array

# Usage 
    
    csv2array(csv_string, opts)

    opts.delimiter (string): value delimiter to use    
    opts.skipwhitespace (boolean): ignore whitespaces between commas

# Example

    var csv2array = require('csv2array');
    var arr = csv2array('"a", "b", "c"\n"d","e","f"');



# Credit 

Code taken from jquery.csv plugin.
