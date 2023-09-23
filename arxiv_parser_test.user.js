// ==UserScript==
// @name         ArxivMetaParserMd
// @namespace    https://github.com/whongzhong/ArxivMetaParserMd
// @version      0.1
// @description  parse meta data from arxiv to markdown file 
// @author       Evan Clark
// @include      arxiv.org
// @match        https://www.tampermonkey.net/documentation.php?ext=dhdg
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// ==/UserScript==

function parser() {
    let url = window.location.href;
    var id_matcher = /.*(abs|pdf)\/(\d*.\d*)/;
    let identifier = url.match(id_matcher);
    if (identifier != null){
         // getting paper identifier
        let method_name = "query";
        let parameters = identifier[2];
        let arxiv_query_url = `https://export.arxiv.org/api/${method_name}?id_list=${parameters}`;

        (async () => {
          try {
            let meta_info = await getxmlstr(arxiv_query_url);

            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(meta_info,"text/xml");
    
            var entry = xmlDoc.getElementsByTagName("entry")[0];
            var title = entry.getElementsByTagName("title")[0].textContent;
            var paper_url = entry.getElementsByTagName("id")[0].textContent;
            var updated_date = entry.getElementsByTagName("updated")[0].textContent;
            var published_date = entry.getElementsByTagName("published")[0].textContent;
            var summary = entry.getElementsByTagName("summary")[0].textContent.trim().replace(/\n/g, '');
            var comment = entry.getElementsByTagName("arxiv:comment")[0].textContent;
            
            var authors = entry.getElementsByTagName("author")
            var authors_list = []
            for(var i = 0; i < authors.length; i++){
                authors_list.push(authors[i].textContent.trim().replace(/\n/g, '')); 
            }
            var authors_str = authors_list.join(', ');
            alert(authors_str)

          } catch (error) {
            console.error('Fetch error:', error);
            // Handle the error
          }
        })();
        
    }
}

async function getxmlstr(url) {
    try {
        const response = await fetch(url);

        // Check if the response status is OK (HTTP status code 200)
        if (!response.ok) {
            throw new Error(`Network response was not ok (status: ${response.status})`);
        }
        return await response.text();
    } catch (error) {
        // Handle errors here, you can log them or perform custom error handling
        console.error('Fetch error:', error);
        throw error; // Re-throw the error if needed
    }
}