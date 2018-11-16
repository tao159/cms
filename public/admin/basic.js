var app = {
    toggle(ele, collectionName, attr, id) {
        $.get('/admin/changeStatus', {
            collectionName,
            attr,
            id
        }, (res) => {
            if (res.success) {
                if (ele.src.indexOf('yes') != -1) {
                    ele.src = '/admin/images/no.gif';
                } else {
                    ele.src = '/admin/images/yes.gif'
                }
            }
        })

    },
    changeSort(ele, collectionName, id) {
        var sortVal = ele.value;
        $.get('/admin/changeSort', { collectionName, sortVal, id }, (res) => {
            console.log(res);
        })
    }
}