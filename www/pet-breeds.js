// Offline suggestions. Free text remains available, including existing breed names.
(() => {
 const catalog={
 'Pas':'Labrador Retriever|Golden Retriever|German Shepherd|Belgian Shepherd Malinois|Siberian Husky|Alaskan Malamute|Samoyed|Akita|Shiba Inu|American Akita|Poodle|Toy Poodle|Bichon Frise|Maltese|Havanese|Bolognese|Coton de Tulear|Shih Tzu|Lhasa Apso|Pekingese|Pomeranian|Chihuahua|Papillon|Pug|French Bulldog|English Bulldog|Boston Terrier|Boxer|Dobermann|Rottweiler|Great Dane|Cane Corso|Bullmastiff|English Mastiff|Dogue de Bordeaux|Dogo Argentino|American Staffordshire Terrier|Staffordshire Bull Terrier|American Pit Bull Terrier|Bull Terrier|Miniature Bull Terrier|Jack Russell Terrier|Parson Russell Terrier|Fox Terrier|Airedale Terrier|Yorkshire Terrier|West Highland White Terrier|Scottish Terrier|Cairn Terrier|Border Terrier|Australian Terrier|Miniature Schnauzer|Standard Schnauzer|Giant Schnauzer|Dachshund|Beagle|Basset Hound|Bloodhound|Dalmatian|English Cocker Spaniel|American Cocker Spaniel|English Springer Spaniel|Cavalier King Charles Spaniel|English Setter|Irish Setter|Gordon Setter|Pointer|German Shorthaired Pointer|Weimaraner|Vizsla|Brittany|Lagotto Romagnolo|Portuguese Water Dog|Spanish Water Dog|Border Collie|Rough Collie|Smooth Collie|Shetland Sheepdog|Australian Shepherd|Australian Cattle Dog|Welsh Corgi Pembroke|Welsh Corgi Cardigan|Old English Sheepdog|White Swiss Shepherd|Dutch Shepherd|Šarplaninac|Tornjak|Kangal Shepherd Dog|Caucasian Shepherd Dog|Central Asian Shepherd Dog|Bernese Mountain Dog|Greater Swiss Mountain Dog|Saint Bernard|Newfoundland|Leonberger|Great Pyrenees|Tibetan Mastiff|Chow Chow|Shar Pei|Basenji|Rhodesian Ridgeback|Greyhound|Whippet|Italian Greyhound|Saluki|Afghan Hound|Borzoi|Irish Wolfhound|Scottish Deerhound|Serbian Hound|Serbian Tricolour Hound|Balkan Hound|Posavac Hound|Istrian Shorthaired Hound|Slovakian Hound|Bavarian Mountain Scent Hound|Norwegian Elkhound|Finnish Spitz|Japanese Spitz|German Spitz|Keeshond|Schipperke|Brussels Griffon|Chinese Crested|Xoloitzcuintle|Dogo Canario|Boerboel|Labradoodle|Goldendoodle|Cockapoo|Cavapoo|Maltipoo',
 'Mačka':'Domestic Shorthair|Domestic Longhair|European Shorthair|British Shorthair|British Longhair|Scottish Fold|Scottish Straight|Persian|Exotic Shorthair|Maine Coon|Norwegian Forest Cat|Siberian|Neva Masquerade|Ragdoll|Ragamuffin|Birman|Siamese|Thai|Balinese|Oriental Shorthair|Bengal|Savannah|Abyssinian|Somali|Russian Blue|Chartreux|Korat|Burmese|Bombay|Tonkinese|Turkish Angora|Turkish Van|Egyptian Mau|Ocicat|American Shorthair|American Curl|American Bobtail|Japanese Bobtail|Manx|Cymric|Devon Rex|Cornish Rex|Selkirk Rex|Sphynx|Peterbald|LaPerm|Singapura|Burmilla|Snowshoe|Toyger|Nebelung',
 'Papagaj':'Budgerigar|Cockatiel|Peach-faced Lovebird|Fischer’s Lovebird|Masked Lovebird|Rose-ringed Parakeet|Alexandrine Parakeet|Monk Parakeet|Green-cheeked Conure|Sun Conure|African Grey Parrot|Timneh Parrot|Blue-fronted Amazon|Yellow-naped Amazon|Eclectus Parrot|Senegal Parrot|Blue-and-yellow Macaw|Scarlet Macaw|Galah|Sulphur-crested Cockatoo',
 'Kanarinac':'Harz Roller|Timbrado Español|Waterslager|Gloster|Border|Fife Fancy|Norwich|Yorkshire|Lizard|Red Factor',
 'Ptica':'Zebra Finch|Gouldian Finch|Society Finch|Java Sparrow|Diamond Dove|Button Quail',
 'Zec':'Holland Lop|Mini Lop|French Lop|English Lop|Netherland Dwarf|Lionhead|Dwarf Hotot|Dutch|Rex|Mini Rex|Flemish Giant|Continental Giant|Californian|New Zealand|English Angora|French Angora|Satin|Havana|Polish|English Spot',
 'Hrčak':'Syrian Hamster|Roborovski Hamster|Winter White Dwarf Hamster|Campbell’s Dwarf Hamster|Chinese Hamster',
 'Morsko prase':'American|Abyssinian|Peruvian|Silkie|Teddy|Texel|Coronet|Rex|Skinny|Baldwin|Lunkarya',
 'Činčila':'Long-tailed Chinchilla|Short-tailed Chinchilla', 'Miš':'Fancy Mouse|African Pygmy Mouse', 'Pacov':'Fancy Rat|Dumbo Rat|Hairless Rat', 'Gerbil':'Mongolian Gerbil|Fat-tailed Gerbil', 'Tvor':'Domestic Ferret', 'Jež':'African Pygmy Hedgehog|Egyptian Long-eared Hedgehog', 'Glodar':'Degu|African Dormouse|Harvest Mouse',
 'Riba':'Goldfish|Koi|Betta|Guppy|Endler’s Livebearer|Neon Tetra|Cardinal Tetra|Zebra Danio|Molly|Platy|Swordtail|Angelfish|Discus|Oscar|Corydoras|Bristlenose Pleco|Rainbowfish|Clownfish|Blue Tang',
 'Kornjača':'Hermann’s Tortoise|Greek Tortoise|Russian Tortoise|Sulcata Tortoise|Leopard Tortoise|Red-footed Tortoise|Red-eared Slider|Yellow-bellied Slider|Common Musk Turtle|Chinese Softshell Turtle',
 'Zmija':'Corn Snake|Ball Python|California Kingsnake|Milk Snake|Boa Constrictor|Western Hognose Snake|Kenyan Sand Boa|Garter Snake',
 'Gušter':'Bearded Dragon|Blue-tongued Skink|Uromastyx|Argentine Black and White Tegu|Green Anole|Chinese Water Dragon', 'Gekon':'Leopard Gecko|Crested Gecko|Gargoyle Gecko|African Fat-tailed Gecko|Tokay Gecko|Giant Day Gecko', 'Iguana':'Green Iguana|Lesser Antillean Iguana|Rhinoceros Iguana', 'Kameleon':'Veiled Chameleon|Panther Chameleon|Jackson’s Chameleon', 'Reptil':'Bearded Dragon|Leopard Gecko|Corn Snake|Hermann’s Tortoise',
 'Žaba':'White’s Tree Frog|Pacman Frog|African Dwarf Frog|African Clawed Frog|Red-eyed Tree Frog', 'Aksolotl':'Wild Type|Leucistic|Albino|Melanoid|Golden Albino', 'Vodozemac':'Axolotl|Fire Salamander|Oriental Fire-bellied Newt|Spanish Ribbed Newt',
 'Pauk':'Regal Jumping Spider|Bold Jumping Spider', 'Tarantula':'Chilean Rose Tarantula|Mexican Redknee Tarantula|Curly Hair Tarantula|Brazilian Black Tarantula|Greenbottle Blue Tarantula', 'Škorpija':'Emperor Scorpion|Asian Forest Scorpion', 'Puž':'Garden Snail|Giant African Land Snail|Mystery Snail|Nerite Snail', 'Rak':'Red Cherry Shrimp|Amano Shrimp|Crystal Red Shrimp|Dwarf Crayfish|Hermit Crab', 'Insekt':'Indian Stick Insect|Giant Leaf Insect|Madagascar Hissing Cockroach|Orchid Mantis',
 'Konj':'Arabian|Thoroughbred|American Quarter Horse|Appaloosa|Paint Horse|Friesian|Lipizzan|Andalusian|Lusitano|Hanoverian|Holsteiner|Trakehner|Dutch Warmblood|Akhal-Teke|Morgan|Haflinger|Shire|Clydesdale|Percheron|Belgian Draft|Bosnian Mountain Horse', 'Poni':'Shetland|Welsh Pony|Connemara|New Forest|Dartmoor|Exmoor|Fell|Dales|Highland|Icelandic Horse|Miniature Horse', 'Magarac':'Miniature Mediterranean|Balkan Donkey|Poitou|American Mammoth Jackstock|Catalan Donkey',
 'Koza':'Alpine|Saanen|Toggenburg|Nubian|Nigerian Dwarf|Pygmy|Boer|Angora|Balkan Goat', 'Ovca':'Merino|Suffolk|Dorper|Texel|Romanov|Valais Blacknose|Ouessant|Shetland|Pramenka', 'Svinja':'Vietnamese Pot-bellied|Kunekune|Göttingen Minipig|Juliana|Mangalica|Berkshire', 'Kokoška':'Silkie|Pekin Bantam|Orpington|Wyandotte|Sussex|Plymouth Rock|Brahma|Cochin|Leghorn|Rhode Island Red|Araucana', 'Patka':'Pekin|Indian Runner|Khaki Campbell|Muscovy|Call Duck|Rouen|Cayuga', 'Guska':'Toulouse|Embden|Chinese|African|Sebastopol|Pomeranian', 'Golub':'Homing Pigeon|Fantail|Jacobin|King|Lahore|Serbian Highflyer', 'Ostalo':''
 };
 const aliases={'German Shepherd':'Nemački ovčar','Labrador Retriever':'Labrador retriver','Golden Retriever':'Zlatni retriver','Belgian Shepherd Malinois':'Belgijski ovčar malinoa','Siberian Husky':'Sibirski haski','Poodle':'Pudla','French Bulldog':'Francuski buldog','English Bulldog':'Engleski buldog','Beagle':'Bigl','Dachshund':'Jazavičar','Pug':'Mops','Maltese':'Maltezer','Domestic Shorthair':'Domaća kratkodlaka mačka','Domestic Longhair':'Domaća dugodlaka mačka','British Shorthair':'Britanska kratkodlaka mačka','Persian':'Persijska mačka','Siamese':'Sijamska mačka','Budgerigar':'Tigrica','Cockatiel':'Nimfa'};
 const srNames=`Alaskan Malamute|Aljaski malamut
Samoyed|Samojed
Toy Poodle|Toj pudla
Bichon Frise|Bišon frize
Havanese|Havanezer
Bolognese|Bolonjezer
Shih Tzu|Ši-cu
Lhasa Apso|Lasa apso
Pekingese|Pekinezer
Pomeranian|Pomeranac
Chihuahua|Čivava
Papillon|Papijon
Boston Terrier|Bostonski terijer
Boxer|Bokser
Dobermann|Doberman
Rottweiler|Rotvajler
Great Dane|Nemačka doga
Cane Corso|Kane korso
Bullmastiff|Bulmastif
English Mastiff|Engleski mastif
Dogue de Bordeaux|Bordoška doga
Dogo Argentino|Argentinska doga
American Staffordshire Terrier|Američki stafordski terijer
Staffordshire Bull Terrier|Stafordski bul terijer
American Pit Bull Terrier|Američki pit bul terijer
Bull Terrier|Bul terijer
Miniature Bull Terrier|Minijaturni bul terijer
Jack Russell Terrier|Džek rasel terijer
Fox Terrier|Foks terijer
Airedale Terrier|Erdel terijer
Yorkshire Terrier|Jorkširski terijer
West Highland White Terrier|Zapadnoškotski beli terijer
Scottish Terrier|Škotski terijer
Cairn Terrier|Kern terijer
Border Terrier|Border terijer
Australian Terrier|Australijski terijer
Miniature Schnauzer|Patuljasti šnaucer
Standard Schnauzer|Srednji šnaucer
Giant Schnauzer|Veliki šnaucer
Basset Hound|Baset
Bloodhound|Bladhaund
Dalmatian|Dalmatinac
English Cocker Spaniel|Engleski koker španijel
American Cocker Spaniel|Američki koker španijel
English Springer Spaniel|Engleski špringer španijel
Cavalier King Charles Spaniel|Kavalirski španijel kralja Čarlsa
English Setter|Engleski seter
Irish Setter|Irski seter
Gordon Setter|Gordon seter
Pointer|Poenter
German Shorthaired Pointer|Nemački kratkodlaki ptičar
Weimaraner|Vajmarski ptičar
Vizsla|Mađarska vižla
Brittany|Bretonski epanjel
Lagotto Romagnolo|Lagoto romanjolo
Portuguese Water Dog|Portugalski vodeni pas
Spanish Water Dog|Španski vodeni pas
Border Collie|Border koli
Rough Collie|Dugodlaki škotski ovčar
Smooth Collie|Kratkodlaki škotski ovčar
Shetland Sheepdog|Šetlandski ovčar
Australian Shepherd|Australijski ovčar
Australian Cattle Dog|Australijski govedar
Old English Sheepdog|Staroengleski ovčar (bobtejl)
White Swiss Shepherd|Beli švajcarski ovčar
Dutch Shepherd|Holandski ovčar
Caucasian Shepherd Dog|Kavkaski ovčar
Central Asian Shepherd Dog|Srednjoazijski ovčar
Bernese Mountain Dog|Bernski planinski pas
Greater Swiss Mountain Dog|Veliki švajcarski planinski pas
Saint Bernard|Bernardinac
Newfoundland|Njufaundlander
Leonberger|Leonberger
Great Pyrenees|Pirinejski planinski pas
Tibetan Mastiff|Tibetanski mastif
Chow Chow|Čau-čau
Shar Pei|Šar-pej
Basenji|Basenji
Rhodesian Ridgeback|Rodezijski ridžbek
Greyhound|Engleski hrt
Whippet|Vipet
Italian Greyhound|Mali italijanski hrt
Afghan Hound|Avganistanski hrt
Borzoi|Ruski hrt
Irish Wolfhound|Irski vučji hrt
Scottish Deerhound|Škotski jelenji hrt
Serbian Hound|Srpski gonič
Serbian Tricolour Hound|Srpski trobojni gonič
Balkan Hound|Balkanski gonič
Posavac Hound|Posavski gonič
Istrian Shorthaired Hound|Istarski kratkodlaki gonič
Slovakian Hound|Slovački gonič
Bavarian Mountain Scent Hound|Bavarski planinski krvoslednik
Norwegian Elkhound|Norveški losov pas
Finnish Spitz|Finski špic
Japanese Spitz|Japanski špic
German Spitz|Nemački špic
Brussels Griffon|Briselski grifon
Chinese Crested|Kineski ćubasti pas
European Shorthair|Evropska kratkodlaka mačka
British Longhair|Britanska dugodlaka mačka
Scottish Fold|Škotska fold mačka
Scottish Straight|Škotska strejt mačka
Exotic Shorthair|Egzotična kratkodlaka mačka
Maine Coon|Mejn kun
Norwegian Forest Cat|Norveška šumska mačka
Siberian|Sibirska mačka
Neva Masquerade|Nevska maskaradna mačka
Ragdoll|Ragdol
Birman|Birmanska mačka
Balinese|Balinežanska mačka
Oriental Shorthair|Orijentalna kratkodlaka mačka
Bengal|Bengalska mačka
Abyssinian|Abisinska mačka
Somali|Somalijska mačka
Russian Blue|Ruska plava mačka
Chartreux|Kartezijanska mačka
Burmese|Burmanska mačka
Bombay|Bombajska mačka
Turkish Angora|Turska angora
Turkish Van|Turski van
Egyptian Mau|Egipatski mau
American Shorthair|Američka kratkodlaka mačka
American Curl|Američki kerl
Devon Rex|Devon reks
Cornish Rex|Korniš reks
Selkirk Rex|Selkirk reks
Sphynx|Sfinks
Holland Lop|Holandski ovnoliki kunić
Mini Lop|Mini ovnoliki kunić
French Lop|Francuski ovnoliki kunić
English Lop|Engleski ovnoliki kunić
Netherland Dwarf|Holandski patuljasti kunić
Lionhead|Lavoglavi kunić
Rex|Reks
Mini Rex|Mini reks
Flemish Giant|Belgijski orijaš
Syrian Hamster|Sirijski hrčak
Roborovski Hamster|Roborovski hrčak
Winter White Dwarf Hamster|Džungarski hrčak
Chinese Hamster|Kineski hrčak
African Grey Parrot|Žako
Blue-and-yellow Macaw|Plavo-žuta ara
Scarlet Macaw|Crvena ara
Domestic Ferret|Domaći tvor
African Pygmy Hedgehog|Afrički patuljasti jež
Goldfish|Zlatna ribica
Guppy|Gupi
Neon Tetra|Neonka
Bearded Dragon|Bradata agama
Leopard Gecko|Leopard gekon
Corn Snake|Kukuruzna zmija
Ball Python|Kraljevski piton`;
 for(const row of srNames.split('\n')){const [name,label]=row.split('|');aliases[name]=label;}
 const tr=(s,e)=>window.petCareI18n.phrase(s,e);
 const speciesOnly=new Set(['Papagaj','Ptica','Hrčak','Činčila','Miš','Pacov','Gerbil','Tvor','Jež','Glodar','Riba','Kornjača','Zmija','Gušter','Gekon','Iguana','Kameleon','Reptil','Žaba','Vodozemac','Pauk','Tarantula','Škorpija','Puž','Rak','Insekt']);
 function choices(type){const special=speciesOnly.has(type)?[['Nepoznato','Unknown'],['Drugo','Other']]:[['Mešanac','Mixed breed'],['Nepoznato','Unknown'],['Drugo','Other']];return special.map(([sr,en])=>({value:sr,label:tr(sr,en)})).concat((catalog[type]||'').split('|').filter(Boolean).map(value=>({value,label:currentLang()==='sr'?(aliases[value]||value):value})));}
 function attach(){const f=document.getElementById('petForm');if(!f||f.dataset.breedsReady)return;f.dataset.breedsReady='true';const input=f.elements.breed,type=f.elements.type;input.setAttribute('list','petBreedSuggestions');input.setAttribute('autocomplete','off');input.maxLength=120;input.placeholder=tr('Izaberite ili upišite rasu / vrstu','Choose or enter breed / species');input.id='petBreedInput';const label=input.parentElement.querySelector('label');if(label)label.htmlFor=input.id;const list=document.createElement('datalist');list.id='petBreedSuggestions';input.after(list);const help=document.createElement('p');help.className='small muted';help.id='petBreedHelp';help.textContent=tr('Predlozi zavise od vrste ljubimca. Možete uneti i drugi naziv; kod ptica, riba i reptila birajte vrstu.','Suggestions depend on your pet’s species. You can enter another name; for birds, fish and reptiles choose a species.');list.after(help);input.setAttribute('aria-describedby',help.id);
 const refresh=()=>{if(label)label.textContent=speciesOnly.has(type.value)?tr('Vrsta','Species'):tr('Rasa','Breed');list.replaceChildren(...choices(type.value).map(x=>{const o=document.createElement('option');o.value=x.label;o.label=x.value;return o;}));};f.refreshBreedSuggestions=refresh;type.addEventListener('change',()=>{input.value='';refresh();});refresh();}
 const previous=render;render=function(){previous();attach();};window.petCareBreeds={catalog,choices,refresh:()=>document.getElementById('petForm')?.refreshBreedSuggestions?.()};attach();
})();
