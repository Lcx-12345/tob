#!/usr/bin/env node


function main() {
    const messages = ["Hello", "World", "Node.js", "Loop", "Demo"];

    messages.forEach((msg, index) => {
        console.log(`${index + 1}. ${msg}`);
    });

    console.log("\n逆序输出:");
    for (let i = messages.length - 1; i >= 0; i--) {
        console.log(`- ${messages[i]}`);
    }
}


main();
