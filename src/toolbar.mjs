export function insertion(text,from,to,key){const selected=text.slice(from,to);const pairs={'()':['(',')'],'[]':['[',']'],'{}':['{','}'],'"':['"','"'],"'": ["'","'"]};if(pairs[key]){const [a,b]=pairs[key];return {from,to,insert:a+selected+b,anchor:from+1,head:from+1+selected.length};}const insert=key==='TAB'?'    ':key;return {from,to,insert,anchor:from+insert.length,head:from+insert.length};}

