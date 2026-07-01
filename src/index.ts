import {createClient} from 'redis';

const subscriber= createClient();
subscriber.connect();

const main= async ()=>{
    while(true){
        const response= await subscriber.brPop(
            'build-queue',
            10
        );
        console.log(response);
    }
}
main();