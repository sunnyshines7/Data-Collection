Parse.Cloud.beforeSave("WaterBodySchedule", async (request, response) => {
	if(request.object.isNew()){
		let count = 0;
		var waterSchedule = Parse.Object.extend("WaterBodySchedule");
		var query = new Parse.Query(waterSchedule);
		count = await query.count();
		console.log(count);
		var sl_no = count + 1;
		request.object.set('sl_no', sl_no); 
		request.object.set('uik', request.object.get('uik')+sl_no);
	}
});

