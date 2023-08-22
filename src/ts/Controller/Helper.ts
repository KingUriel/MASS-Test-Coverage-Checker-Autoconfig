
export function readFile(file:File): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          resolve(content);
        };
        reader.onerror = (event) => {
          reject(new Error("Error reading file"));
        };
        reader.readAsText(file);
      } catch (error) {
        reject(error);
      }
    });
  }


export function getPositionString(string, subString, index) {
  return string.split(subString, index).join(subString).length;
}

export function getParsedDate(): string{
  const parseTime = function(timeElement: number): string{
    return timeElement < 10 ? "0"+timeElement : ""+timeElement;
  }
  let currentdate = new Date(); 
  let datetime =  parseTime(currentdate.getDate()) + "."
                  + parseTime(currentdate.getMonth()+1)  + "." 
                  + parseTime(currentdate.getFullYear()) + " "  
                  + parseTime(currentdate.getHours()) + ":"  
                  + parseTime(currentdate.getMinutes()) + ":" 
                  + parseTime(currentdate.getSeconds());
  return datetime;
}


export function calculateTxtFileWeight(text: string, round): number {
  // Calculate the weight of the string in bytes
  //const bytes = Buffer.byteLength(text, 'utf8');
  
  // Assuming each character in the string is encoded using UTF-8
  const bytesPerCharacter = 1;
  
  // Calculate the total number of bytes
  const totalBytes = text.length * bytesPerCharacter;
      
  // Convert bytes to kilobytes
  const totalKilobytes = totalBytes / 1024;
    
  return Math.round(totalKilobytes * (10**round)) / 100;
}



/**
 * Download a zip file from a given URL and put it in an input file field.
 * 
 * @param url The URL of the zip file to download.
 * @param inputFieldId The ID of the input file field to put the downloaded file in.
 * @returns Returns a Promise that resolves when the file is successfully downloaded and put in the input field, or rejects with an error message.
 */
export function downloadZipFile(url: string, inputFieldId: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
      // Validate the input
      if (!url || !inputFieldId) {
          reject("Invalid input. URL and input field ID are required.");
      }

      // Fetch the zip file
      fetch(url)
          .then(response => {
              if (!response.ok) {
                  throw new Error(`Failed to download zip file. Status: ${response.status} ${response.statusText}`);
              }
              return response.blob();
          })
          .then(blob => {
              // Create a new FileReader
              const reader = new FileReader();

              // Set the onload event handler to put the file contents in the input field
              reader.onload = () => {
                  const fileContents = reader.result;
                  const inputFile = document.getElementById(inputFieldId) as HTMLInputElement;
                  const fileValue = new File([fileContents], "downloaded.zip");

                  // Create a DataTransfer to get a FileList
                  const dataTransfer = new DataTransfer();
                  dataTransfer.items.add(fileValue);
                  
                  //Add files in principal file's input-field
                  inputFile.files = dataTransfer.files;
                  resolve();
              };

              // Read the blob as Array Buffer
              reader.readAsArrayBuffer(blob);
            
          })
          .catch(error => {
              reject(`Failed to download zip file. ${error.message}`);
          });
  });
}
