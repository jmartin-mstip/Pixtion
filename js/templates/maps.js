/* PIXTION · templates/maps.js — hand-drawn 16×16 sprite maps for the starter templates. */

export const MAPS = {
  hero: ['................','.....kkkkkk.....','....kwwwwwwk....','....kwaaaawk....','....kakaakak....','....kaaaaaak....','....kaarraak....','.....kkkkkk.....','....kddddddk....','...kkddddddkk...','...kaddddddak...','...kkddddddkk...','....kxxxxxxk....','....kxxkkxxk....','....kxxkkxxk....','...kwwwkkwwwk...'],
  cat: ['................','..kk........kk..','..kfk......kfk..','..kffkkkkkkffk..','..kffffffffffk..','.kffffffffffffk.','.kffkkffffkkffk.','.kffklffffklffk.','.kffffffffffffk.','.kfffffjjfffffk.','.kffffkffkffffk.','.kfffffkkfffffk.','..kffffffffffk..','...kffffffffk...','....kkkkkkkk....','................'],
  house: ['................','.......kk.......','......krrk......','.....krrrrk.....','....krrrrrrk....','...krrrrrrrrk...','..krrrrrrrrrrk..','.kkkkkkkkkkkkkk.','..kSSSSSSSSSSk..','..kSkkkSSkkkSk..','..kSkbkSSkwkSk..','..kSkkkSSkwkSk..','..kSSSSSSkwkSk..','..kSSSSSSkwkSk..','eeeeeeeeeeeeeeee','nnnnnnnnnnnnnnnn'],
  tree: ['................','......kkkk......','....kkeeeekk....','...keeeeeeeek...','..keeereeeeeek..','..keeeeeemeeek..','.keeemeeeeeerek.','.keeeeeeeeemeek.','..keeereeeeeek..','...kkeeeeeekk...','......kwwk......','......kwwk......','......kwwk......','.....kwwwwk.....','mmmmmmmmmmmmmmmm','eeeeeeeeeeeeeeee']
};

/** Runs once at start-up, in the original order. */
export function init() {
  Object.assign(MAPS, {
    mushroom: ['................','.....kkkkkk.....','...kkrrrrrrkk...','..krrWWrrrrrrk..','.krrWWWWrrWWrrk.','.krrrWWrrrWWWrk.','krrrrrrrrrrrrrrk','krrWWrrrrrrWWrrk','kkkkkkkkkkkkkkkk','....kcccccck....','....kckcckck....','....kcccccck....','....kcccccck....','....kcccccck....','.....kkkkkk.....','................'],
    flower: ['................','......kkkk......','.....kjjjjk.....','..kkkjjjjjjkkk..','.kjjjkjjjjkjjjk.','.kjjjjkyykjjjjk.','.kjjjjyyyyjjjjk.','..kjjjyyyyjjjk..','...kkjjyyjjkk...','....kjjjjjjk....','.....kkeekk.....','.......ee.......','...eee.ee.eee...','....eeeeeeee....','......eeee......','mmmmmmmmmmmmmmmm'],
    potion: ['................','......kkkk......','......kwwk......','.....kkkkkk.....','......kffk......','......kffk......','.....kffffk.....','....kfWffffk....','...kfWffffffk...','...kqqqqqqqqk...','...kqqhqqqqqk...','...kqqqqqhqqk...','...kqqqqqqqqk...','....kqqqqqqk....','.....kkkkkk.....','................'],
    robot: ['.......rr.......','.......kk.......','...kkkkkkkkkk...','...kggggggggk...','...kgllggllgk...','...kgllggllgk...','...kggggggggk...','...kggkkkkggk...','...kkkkkkkkkk...','..kkggggggggkk..','.kgkggyyrrggkgk.','.kgkggggggggkgk.','..kkggggggggkk..','....kggkkggk....','....kggkkggk....','...kkkk..kkkk...'],
    icecream: ['................','......kkkk......','.....kjjjjk.....','....kjjjjjjk....','....kjjWjjjk....','...kjjjjjjjjk...','...kuuuuuuuuk...','..kuuuuuuuuuuk..','..kuuruuuuruuk..','..kkkkkkkkkkkk..','...kCaCaCaCak...','....kaCaCaCk....','.....kCaCak.....','......kaCk......','.......kk.......','................'],
    ghost: ['................','.....kkkkkk.....','....kWWWWWWk....','...kWWWWWWWWk...','..kWWWWWWWWWWk..','..kWWkkWWkkWWk..','..kWWkkWWkkWWk..','..kWWWWWWWWWWk..','..kWWWjWWjWWWk..','..kWWWWkkWWWWk..','..kWWWWWWWWWWk..','..kWWWWWWWWWWk..','..kWWWWWWWWWWk..','..kWkWWkkWWkWk..','..kk.kk..kk.kk..','................']
  });

  Object.assign(MAPS, {
    chest: ['................','................','...kkkkkkkkkk...','..kwCCCCCCCCwk..','.kwCCCCCCCCCCwk.','.kwwwwwwwwwwwwk.','.kkkkkkyykkkkkk.','.kwCCCkyykCCCwk.','.kwCCCCkkCCCCwk.','.kwCCCCCCCCCCwk.','.kwwwwwwwwwwwwk.','.kwCCCCCCCCCCwk.','.kwCCCCCCCCCCwk.','.kwwwwwwwwwwwwk.','.kkkkkkkkkkkkkk.','................'],
    sword: ['..............kk','.............kWk','............kWfk','...........kWfk.','..........kWfk..','.........kWfk...','........kWfk....','.......kWfk.....','......kWfk......','..kk.kWfk.......','..kykWfk........','...kyyk.........','..kwkyyk........','.kwk.kyk........','kwk...kk........','kk..............'],
    cupcake: ['................','.......kk.......','......krrk......','.....kkkkkk.....','....kjjjjjjk....','...kjjWjjjjjk...','..kjjjjjjjjjjk..','..kjuujjjjujjk..','.kkkkkkkkkkkkkk.','.kCaCaCaCaCaCak.','..kCaCaCaCaCak..','..kaCaCaCaCaCk..','...kCaCaCaCak...','...kaCaCaCaCk...','....kkkkkkkk....','................'],
    frog: ['................','..kkk......kkk..','.kWWWk....kWWWk.','.kWkWk....kWkWk.','.kWWWkkkkkkWWWk.','kmmmmmmmmmmmmmmk','kmjmmmmmmmmmmjmk','kmmkmmmmmmmmkmmk','kmmmkkkkkkkkmmmk','kmmmmmmmmmmmmmmk','.kmmmmmmmmmmmmk.','.kmmuuuuuuuummk.','kmmmuuuuuuuummmk','kmmkuuuuuuuukmmk','kkkkkkkkkkkkkkkk','................'],
    penguin: ['................','.....kkkkkk.....','....kkkkkkkk....','...kkkWWWWkkk...','...kkWkWWkWkk...','...kkWWooWWkk...','..kkkWWWWWWkkk..','..kkWWWWWWWWkk..','.kkkWWWWWWWWkkk.','.kkkWWWWWWWWkkk.','..kkWWWWWWWWkk..','..kkWWWWWWWWkk..','...kkWWWWWWkk...','....kkkkkkkk....','...ooo....ooo...','................'],
    burger: ['................','................','.....kkkkkk.....','...kkCCCCCCkk...','..kCCuCCCuCCCk..','.kCCCCCuCCCCuCk.','.kkkkkkkkkkkkkk.','.keeeeeeeeeeeek.','kyyyyyyyyyyyyyyk','.kwwwwwwwwwwwwk.','.kwwwwwwwwwwwwk.','.krrrrrrrrrrrrk.','.kkkkkkkkkkkkkk.','.kCCCCCCCCCCCCk.','..kkkkkkkkkkkk..','................']
  });

  Object.assign(MAPS, {
    cactus: ['................','......kjjk......','......kmmk......','......kmmk......','..kk..kmmk......','.kmmk.kmmk..kk..','.kmmk.kmmk.kmmk.','.kmmkkkmmk.kmmk.','..kmmmmmmk.kmmk.','...kkkmmmkkkmmk.','......kmmmmmmk..','......kmmkkkk...','......kmmk......','....kkkkkkkk....','.....kCCCCk.....','.....kkkkkk.....'],
    pizza: ['................','.kkkkkkkkkkkkkk.','.kCCCCCCCCCCCCk.','.kCCCCCCCCCCCCk.','..kuuuruuuuuuk..','..kuurrruuuuuk..','...kuuruuuruk...','...kuuuuurrrk...','....kuuuuurk....','....kurruuuk....','.....kurruk.....','.....kuuuuk.....','......kuuk......','......kuuk......','.......kk.......','................'],
    owl: ['................','..kk........kk..','..kwkkkkkkkkwk..','..kwwwwwwwwwwk..','.kwWWWwwwwWWWwk.','.kwWkWwyywWkWwk.','.kwWWWwyywWWWwk.','.kwwwwwwwwwwwwk.','.kwwCCCCCCCCwwk.','.kwCCwCCwCCwCwk.','.kwCCCCCCCCCCwk.','.kwwCwCCwCCwwwk.','..kwwCCCCCCwwk..','...kwwwwwwwwk...','wwwwwoowwoowwwww','................'],
    bunny: ['....kk....kk....','...kWk....kWk...','...kjk....kjk...','...kjk....kjk...','...kWkkkkkkWk...','..kWWWWWWWWWWk..','.kWWWWWWWWWWWWk.','.kWWkWWWWWWkWWk.','.kWjWWWjjWWWjWk.','.kWWWWkWWkWWWWk.','..kWWWWkkWWWWk..','...kkWWWWWWkk...','..kWWWWWWWWWWk..','..kWWkWWWWkWWk..','..kkkk....kkkk..','................']
  });
}
