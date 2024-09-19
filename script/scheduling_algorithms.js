function printTable() {
    // Get the content of the table and the additional elements
    var tableContent = document.getElementById("resultTable").outerHTML;
    var avgTAT = document.getElementById("showAVGTAT").outerHTML;
    var avgWT = document.getElementById("showAVGWT").outerHTML;

    // Combine the table and additional content
    var combinedContent = tableContent + "<br>" + avgTAT + "<br>" + avgWT;

    // Store original page content
    var originalContent = document.body.innerHTML;

    // Replace the page content with the combined content and print
    document.body.innerHTML = combinedContent;
    window.print();

    // Restore original content after printing
    document.body.innerHTML = originalContent;
}
