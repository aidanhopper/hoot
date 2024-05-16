import Game from './game';
import { createClient } from '@supabase/supabase-js';

const Home = () => {

    /* 
    const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,
                                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    const roomOne = client.channel('room-one')

    const messageRecieved = (payload) => {
      console.log(payload); 
    }
  
    roomOne.send({
      type: 'broadcast',
      event: 'test',
      payload: { message: 'hello, world' },
    });

    roomOne.on(
      'broadcast', 
      { event: 'test' },
      (payload) => messageRecieved(payload),
    ).subscribe();
    */

    return (
      <div className="bg-white h-screen font-sans overflow-hidden">
        <Game/> 
      </div>
    );

}

export default Home;
