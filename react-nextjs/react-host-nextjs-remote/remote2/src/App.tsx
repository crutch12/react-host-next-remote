import React from 'react';
// import NextjsRemoteComponent from 'remote/nextjs-remote-component';
// import NextjsRemotePage from 'remote/nextjs-remote-page';
import { init, loadRemote } from '@module-federation/runtime';

init({
    name: 'host',
    remotes: [
        {
            name: 'remote',
            entry: 'http://localhost:8081/_next/static/chunks/remoteEntry.js'
        }
    ],
})

const NextjsRemoteComponent = React.lazy(() => loadRemote('remote/nextjs-remote-component'))
const NextjsRemotePage = React.lazy(() => loadRemote('remote/nextjs-remote-page'))

function App() {
  return (
    <>
      <div>This is the React container App hosted at localhost:8080</div>
        {/*<React.Suspense fallback="loading NextjsRemoteComponent">*/}
        {/*    <NextjsRemoteComponent />*/}
        {/*</React.Suspense>*/}
        {/*<React.Suspense fallback="loading NextjsRemotePage">*/}
        {/*    <NextjsRemotePage />*/}
        {/*</React.Suspense>*/}
    </>
  );
}

export default App;
