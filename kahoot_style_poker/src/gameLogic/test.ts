import { Game } from './Game.ts';
import { Player } from './Player.ts';


async function Test() {
    const player1 = new Player('Magnus');
    const player2 = new Player('Magnus2');
    const player3 = new Player('Magnus3');
    const player4 = new Player('Magnus4');
    const player5 = new Player('Magnus5');
    const game = new Game([player1, player2, player3, player4, player5]);


    game.startNewRound();
    for (const player of game.players) {
        console.log(player.name + ' has ' + player.chips + ' number of chips left' + ' with cards ' + player.hand)
    }

    await game.collectBets();
    game.getPot();
    game.nextPhase();
    game.getCommunityCards();
    

    await game.collectBets();
    game.getPot();
    game.nextPhase();
    game.getCommunityCards();
    
    await game.collectBets();
    game.getPot();
    game.nextPhase();
    game.getCommunityCards();

    await game.collectBets();
    game.getPot();
    game.nextPhase();
    game.getCommunityCards();

    



}


Test();