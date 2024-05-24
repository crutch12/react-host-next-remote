const esbuild = require('esbuild')
const { NativeFederationTypeScriptHost } = require('@module-federation/native-federation-typescript/esbuild')
const { rm, stat } = require('node:fs/promises');
const path = require('node:path');
const { execSync } = require('child_process');

const remotes = [
    {
        name: 'cursOfkr',
        url: 'http://localhost:8080',
        typesFolder: '@mf-types',
    },
    {
        name: 'cursDfbs',
        url: 'http://localhost:8080',
        typesFolder: '@mf-types',
    },
    {
        name: 'cursApp',
        url: 'http://localhost:8081',
        typesFolder: '@mf-types',
    },
]

const deleteTypesFolder = async (
    destinationPath,
) => {
    await rm(destinationPath, {
        recursive: true,
        force: true,
    }).catch((error) =>
        console.error(ansiColors.red(`Unable to remove types folder, ${error}`)),
    );
};

// const federationConfig = {
//     remotes: {
//         // remote: 'remote@http://localhost:8081/_next/static/chunks/remoteEntry.js',
//         cursOfkr: 'http://localhost:8080',
//         cursDefb: 'http://localhost:8080',
//         cursApp: 'http://localhost:8081',
//     },
// }

const run = async () => {
    for (const remote of remotes) {
        const federationConfig = {
            remotes: {
                [remote.name]: remote.url
            }
        }
        const typesFolder = path.resolve(remote.typesFolder, remote.name)

        console.log('typesFolder', typesFolder)
        await deleteTypesFolder(typesFolder)

        await esbuild.build({
            plugins: [
                NativeFederationTypeScriptHost({
                    moduleFederationConfig: federationConfig,
                    deleteTypesFolder: false,
                    typesFolder: remote.typesFolder // /@mf-types.zip // /@mf-types.d.ts
                }),
            ],
        })


        try {
            await stat(typesFolder)
        }
        catch (err) {
            console.error('typesFolder not exist', typesFolder)
            console.info(`Resoring typesFolder: $ git checkout -- ${typesFolder}`)
        }
        // if ()

        // execSync('git checkout -- path/to/folder')
    }
}

run()

