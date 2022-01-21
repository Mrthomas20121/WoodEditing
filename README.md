# WoodEditing
this tool was made for my mods to do mod compat more easily with wood planks.
## how does it work?
Basically it replace the base texture pixel by the other texture pixels
## how to use it?
- Make sure you have NodeJS version 16.10.0(or higher) installed. Then run npm install after cloning the repo.
- create a folder default, export and planks in here.
- Edit the arrays plank_types and planks in the index.js file and put the mod plank types and planks in there instead.
- put the base textures for the plank types in there. make sure the name is `planks_plank_type` where plank_type is the name of the plank type.
- put the planks texture in the planks folder and once again make sure the plank texture name is `plank_name_plank` where plank_name is the name of the plank.
- run the program by doing `node index.js`, you're done.
## can i use this for more than just planks?
yes you can but if you do so you will need to change some things.