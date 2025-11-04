import reactFiles from './react';
import vanillaFiles from './vanilla';
import angularFiles from './angular';

export const getFiles = (framework: string, usecase: string | null = 'video', mode: string = 'editor') => {
    const files = framework === 'react' 
    ? reactFiles 
    : framework === 'angular' 
    ? angularFiles : vanillaFiles;

    const filteredFiles = files.filter((file) => file.usecase === usecase || file.usecase === "all");
    
    // If mode is token, filter children to only include join.ts
    if (mode === 'token') {
        return filteredFiles.map((file) => ({
            ...file,
            children: file.children?.filter((child) => child.name === 'join.ts')
        }));
    }
    
    return filteredFiles;
}