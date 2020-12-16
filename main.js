// -- Közmunka bot main.js -- \\
// -- itt található minden ami ezt a botot működteti -- //

// lekérünk pár dolgot amit MUSZÁLY lekérni
const Discord = require('discord.js');
const Client = new Discord.Client();
const prefix = '.';

// Ha a bot teljesen elindult akkor ez lefut
Client.once('ready', () =>
{
    // Beállítjuk az egyedi státuszt
    Client.user.setActivity('WiTh uR MoM', { type: 'PLAYING' })

    // Consolera kiírunk egy kis fancy szöveget
    console.log('')
    console.log('   || Bot Online !');
    console.log('   || --------------');
    console.log('   || Have Fun ! :D');
    console.log('   || --------------');
    console.log('   || Made by: Granilla Péter');
    console.log('   || --------------');
    console.log('   || Source available @ github.com/Lellolxs/PetersFunDiscordBot');
    console.log('   || --------------');
    console.log('   || If you encounter a bug, or a crash. Feel free to report it at:');
    console.log('   || -> github.com/Lellolxs/PetersFunDiscordBot/issues');
    console.log('');

});

// Hibaüzenetek
let errorMessages = ["Túl Kevés Paraméter", "Túl Sok Paraméter", "Helytelen Használat", "Nincs ilyen felhasználó a szerveren", "Nincs Jogod közmunkát osztani", "Már van valaki közmunkán, nyugi :P" ];
// Közmunka szavak (ezek lesznek randomizálva)
let szavak = ["kozmunka137", "kozmunka2079", "kozmunka3146", "kozmunka4112", "kozmunka96515"];
// Többi unalmas szar változó
let kozmunkafoglalt = false;
let current_szo = null;
let kozmunka_left = 0;

// Újszó funkció
function newWord()
{
    // Visszaad egy random szót a szavak táblából.
    return szavak[Math.floor(Math.random() * 5)];
}

// Ha üzit küldenek ( ez már akkor fut amikor a közmunka elindult. )
Client.on('message', message => {

    let server = message.guild; // szerver ( message.guild.id az id-ért)

    const kozmunkas_channel = Client.channels.cache.get("763830485390327879"); // ez a változó a közmunkás csatornát kéri le, de Mivel id alapján van a lekérés, ezért ha a 9B szerveren kívül akarjuk használni akkor ezt át kell írni annak a szervernek a közmunka csatijára
    const kozmunkarole = message.guild.roles.cache.find(r => r.name === "Közmunkás"); // Név alapján lekérjük a közmunkás rangot
    const bajnokrole = message.guild.roles.cache.find(r => r.name === "Bajnok"); // Név alapján lekérjük a Bajnok rangok

    // Ha az üzenetet nem bot küldte
    if ( !message.author.bot )
    {
        // Ha az üzenet a közmunkás csatornába lett küldve
        if (message.channel === kozmunkas_channel )
        {
            // Ha az üzenet küldőjén van "Közmunkás" rang
            if ( message.member.roles.cache.some(r => r.name === "Közmunkás") )
            {
                // Ha foglalt a közmunka ( azaz van valaki közmunkán )
                if (kozmunkafoglalt)
                {
                    // Ha a szó amit a felhasználó beírt egyezik a random generált szóval
                    if ( message.content.toLowerCase() === current_szo )
                    {
                        // Ha egy közmunka maradt hátra 
                        if ( +kozmunka_left == 1 )
                        {
                            message.member.roles.remove(kozmunkarole);
                            message.member.roles.add(bajnokrole);
                            kozmunkafoglalt = false;
                            const endingMessage = new Discord.MessageEmbed().addFields({ name: 'Közmunka:',value: "***__Helyes válasz !!!__***\n\n" + message.author.username + " - Kivitte a közmnunkát. \n\n ||attól még szar volt||"});
                            kozmunkas_channel.send(endingMessage);
                        }
                        // Ha nem egy közmunka van hátra
                        else{
                            kozmunka_left = +kozmunka_left - 1;
                            current_szo = newWord();
                            const sucsessMessage = new Discord.MessageEmbed().addFields({ name: 'Közmunka:',value: "***__Helyes válasz !!!__***\n\nHátramaradt közmunka: " + kozmunka_left + "\n\nÍrd be ezt a szót helyesen: "  + "||" + current_szo + "||"});        
                            kozmunkas_channel.send(sucsessMessage);
                        }
                    }
                    // Ha a felhasználó által beírt szó nem egyezik a random generáltal
                    else
                    {
                        kozmunka_left = +kozmunka_left + 1;
                        current_szo = newWord();
                        const failMessage = new Discord.MessageEmbed().addFields({ name: 'Közmunka:',value: "***__Helytelen válasz !!!__***\n\nHátramaradt közmunka: " + kozmunka_left + "\n\nÍrd be ezt a szót helyesen: "  + "||" + current_szo + "||"});

                        kozmunkas_channel.send(failMessage);
                    }
                }
            } // Ha nem közmunkás akkor nem szarozunk vele, megy a return
            else { return; }
        }
    }

})

// Amikor üzenetet küldenek ( ez kezeli a parancsot, és a megadott paramétereket )
Client.on('message', message => {


    var args = message.content.slice(prefix.length).trim().split(/ +/); // Ez egy bonyolult módszer ami csak annyira jó hogy megnézzük hogy hol van szóköz és szóközök alapján elválasztjuk a parancs paramétereit, és egy táblába teszük őket
    const command = args.shift().toLowerCase(); // Lekérjük a parancs szövegét, hasznos ha több parancsot akarunk egy botba rakni

    const guild = Client.guilds.cache.get("751526383435382805"); //  igazából ez a szerver object.

    // Ezeket lekérjük mégegyszer... mert.... azért mert így működik... lehet menne enélkül is.
    const kozmunkas_channel = Client.channels.cache.get("763830485390327879"); // ez a változó a közmunkás csatornát kéri le, de Mivel id alapján van a lekérés, ezért ha a 9B szerveren kívül akarjuk használni akkor ezt át kell írni annak a szervernek a közmunka csatijára
    const kozmunkarole = message.guild.roles.cache.find(r => r.name === "Közmunkás"); // Név alapján lekérjük a közmunkás rangot
    const bajnokrole = message.guild.roles.cache.find(r => r.name === "Bajnok"); // Név alapján lekérjük a Bajnok rangok


    // Ha az üzenet prefixel kezdődik (".")
    if (message.content.startsWith(prefix))
    {
        // Ha nem bot küldte
        if ( !message.author.bot )
        {
            // Ha a command teljesen egyenlő a "közmunka" szóval.
            if ( command === "közmunka" )
            {
                // Ha az üzenet küldője rendelkezik a Közmunkáltató rangal ( azaz van joga közmunkát osztani )
                if ( message.member.roles.cache.find(r => r.name === "Közmunkáltató") )
                {
                    // Ha kevesebb mint 2 paraméter lett megadva
                    if (args.length < 2)
                    {
                        message.channel.send(errorMessages[0]); // Viszaadunk egy hibaüzenetet
                    }
                    // Ha több mint kettő paraméter lett megadva
                    else if (args.length > 2)
                    {
                        message.channel.send(errorMessages[1]);// Viszaadunk egy hibaüzenetet
                    }
                    // Ha minden király
                    else
                    {
                        // Ha nem foglalt a közmunka
                        if (!kozmunkafoglalt)
                        {
                            // Ha a közmunka mennyiségének nem valós számot adtunk meg
                            if ( Number.isNaN(+args[1]) )
                            {
                                message.channel.send(errorMessages[2]); // Viszaadunk egy hibaüzenetet
                            }
                            // Ha minden király
                            else
                            {
                                // Lekérjük az üzenet első említését ( azaz azt a embert aki közmunkát fog kapni )
                                const mention = message.mentions.users.first();

                                // Ha valós az említés, azaz a szerveren létező embert említettek
                                if ( mention != null) 
                                {
                                    // Az említésből lekérjük a felhasználót
                                    const member = guild.members.cache.get(mention.id);

                                    kozmunkafoglalt = true; // A közmunka foglalt lesz, azaz nem lehetlesz közmunkát osztani
                                    kozmunka_left = args[1]; // Beállítjuk a "kozmunka_left" változót arra az értékre amit a "közmunka osztó" megadott
                                    current_szo = newWord(); // Generálunk egy új szót

                                    member.roles.remove(bajnokrole), // Elveszük a bajnok rangot a "közmunkástól"
                                    member.roles.add(kozmunkarole); // Rárakjuk a közmunkás rangot a közmunkásra

                                    // Ez egy embed, azaz egy szép üzenet.
                                    const startingMessage = new Discord.MessageEmbed().addFields({ name: 'Közmunka:',value: "*SOK SIKERT A KÖZMUNKÁHOZ !! ( hehe )*\n\nHátramaradt közmunka: " + kozmunka_left + "\n\nÍrd be ezt a szót helyesen: "  + "||" + current_szo + "||"});

                                    // Elküldjük az előbb említett embedet közmunka csatornába, azaz elkezdjük a közmunkát
                                    kozmunkas_channel.send(startingMessage);

                                    // Végül leigazoljuk a közmunka osztónak hogy sikeresen kiosztotta a közmunkát
                                    message.channel.send( "<@" + message.author.id + "> **| Sikeresen kiosztott *" + args[1] + "* közmunkát " + "<@" + mention.id + ">-nak/nek** ( hehe, that felt good )" );
                                }
                                // Ha nincs ilyen felhasználó a szerveren, vagy valami más hiba lépett fel.
                                else
                                {
                                    message.channel.send(errorMessages[3]); // Viszaadunk egy hibaüzenetet
                                }
                            }
                        }
                        // Ha foglalt a közmunka
                        else
                        {
                            message.channel.send(errorMessages[5]); // Viszaadunk egy hibaüzenetet
                        }
                    }
                }
                // Ha nincs engedélye közmunkát osztani a felhasználónak aki a parancsot beküldte
                else
                {
                    message.channel.send(errorMessages[5]); // Viszaadunk egy hibaüzenetet
                }
            }
        }
    }
})

// Ez kell. Kész. Ezzel jelentkezik be a bot.
Client.login('NzYzNzA4MTU1MzA1MjYzMTE0.X37opQ.0idSCGxv0voQnt2M9WLeSnpWA6s');

