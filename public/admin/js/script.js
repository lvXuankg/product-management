// Button status

const buttonsStatus = document.querySelectorAll("[button-status]");
if(buttonsStatus.length > 0){
    let url = new URL(window.location.href);
    // console.log(url);

    buttonsStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            
            if(status){
                url.searchParams.set("status", status);
            } else{
                url.searchParams.delete("status");
            }
            window.location.href = url;
        });
    });
}
// End Button Status 

// Form Search 
const formSearch = document.querySelector("#form-search");
if(formSearch){
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;
        let url = new URL(window.location.href);
        if(keyword){
            url.searchParams.set("keyword", keyword);
        } else{
            url.searchParams.delete("keyword");
        }
        window.location.href = url;
    })
}

// End From Search 

// Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if(buttonsPagination){
    let url = new URL(window.location.href);

    buttonsPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");
            console.log(page);

            url.searchParams.set("page", page);
            window.location.href = url.href;
        });
    });
}
// End Pagination 

// Checkbox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if(checkboxMulti){
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']");
    
    inputCheckAll.addEventListener("click", () => {
        if(inputCheckAll.checked){
            inputsId.forEach(input => {
                input.checked = true;
            });
        }
        else{
            inputsId.forEach(input => {
                input.checked = false;
            });
        }
    });

    inputsId.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;
            if(countChecked == inputsId.length ){
                inputCheckAll.checked = true;
            }
            else{
                inputCheckAll.checked = false;
            }
        });
    });
}
// End Checkbox Multi 

// Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti){
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const checkBoxMulti = document.querySelector("[checkbox-multi]");
        const inputsChecked = checkBoxMulti.querySelectorAll(
            "input[name='id']:checked"
        );
        
        const typeChange = e.target.elements.type.value;
        
        if(typeChange == "delete-all"){
            const isConfirm = confirm("Bạn có chắc xóa không?");

            if(!isConfirm) return;
        }

        if(inputsChecked.length > 0){
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']"); 

            inputsChecked.forEach(input => {
                const id = input.value;

                if(typeChange == "change-position"){
                    const position = input.closest("tr").querySelector("input[name='position']").value;

                    // console.log(`${id}-${position}`);
                    ids.push(`${id}-${position}`);
                }
                else{
                    ids.push(id);
                }
                
            });
            inputIds.value = ids.join(", ");

            formChangeMulti.submit();
        }
        else{
            alert("Vui lòng chọn ít nhất một bảng ghi");
        }
    });
} 


// End Form Change Multi 
