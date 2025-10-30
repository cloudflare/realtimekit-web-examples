import reactFiles from './react';
import vanillaFiles from './vanilla';
import angularFiles from './angular';

export const getFiles = (framework: string, usecase: string | null = 'video') => {
    const files = framework === 'react' 
    ? reactFiles 
    : framework === 'angular' 
    ? angularFiles : vanillaFiles;

    return files.filter((file) => file.usecase === usecase);
}