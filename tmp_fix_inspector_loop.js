const fs = require('fs');
const filePath = 'c:\\molendavdevelopment\\mdk\\components\\builder\\Inspector.tsx';
let content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

// Find coordinates of select holding updateNodeBinding
const searchSub = 'onChange={(e) => updateNodeBinding(activeNode.id, key, e.target.value === "" ? null : e.target.value)}';
const index = content.indexOf(searchSub);

if (index !== -1) {
    // 1. We found the select. Let's trace backwards to replace the comment and condition wrapper
    // Find the previous condition: builderMode === "component"
    const prevBlockIndex = content.lastIndexOf('{builderMode === "component" && key !== "className" && (', index);
    const prevCommentIndex = content.lastIndexOf('{/* POWIĄZANIE (BINDING)', index);

    // Find the end of outer condition wrapper: )}
    // We look forward to )} which DOM maps the select wrapper 
    const nextCloseIndex = content.indexOf(')}', index);

    if (prevBlockIndex !== -1 && nextCloseIndex !== -1) {
         const matchBlock = content.substring(prevBlockIndex, nextCloseIndex + 2);
         
         const replaceBlock = `{(builderMode === "component" || isInsideLoop) && key !== "className" && (
                                 <div className="flex items-center gap-1">
                                     <label className="text-[8px] font-bold text-zinc-600 uppercase">Bind:</label>
                                     <select 
                                        value={isBound || ""}
                                        onChange={(e) => updateNodeBinding(activeNode.id, key, e.target.value === "" ? null : e.target.value)}
                                        className="bg-black border border-zinc-800 text-[10px] text-[#f97316] h-6 px-1 outline-none rounded-sm"
                                     >
                                         <option value="">Static</option>
                                         {isInsideLoop && (
                                           <>
                                             <option value="item.title">item.title</option>
                                             <option value="item.desc">item.desc</option>
                                             <option value="item.image">item.image</option>
                                           </>
                                         )}
                                         {Object.keys(variables).map(vName => (
                                           <option key={vName} value={vName}>{vName}</option>
                                         ))}
                                     </select>
                                 </div>
                             )}`;

         content = content.substring(0, prevBlockIndex) + replaceBlock + content.substring(nextCloseIndex + 2);
         fs.writeFileSync(filePath, content, 'utf8');
         console.log("Inspector.tsx bindings updated successfully via script!");
    } else {
         console.log("Failed to find wrapping boundaries inside Index finder.");
    }
} else {
    console.log("Failed to find select marker inside Inspector.tsx!");
}
