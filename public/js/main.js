var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "home",
        "icons"	: "list",
        "icons/page/:page"	: "list",
        "icons/add"         : "addIcon",
        "icons/:id"         : "iconDetails",
        "about"             : "about",
        "browse"            : "browse"
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    home: function (id) {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
        this.headerView.selectMenuItem('home-menu');
    },

	list: function(page) {
        var p = page ? parseInt(page, 10) : 1;
        var iconList = new IconCollection();
        iconList.fetch({success: function(){
            $("#content").html(new IconListView({model: iconList, page: p}).el);
        }});
        this.headerView.selectMenuItem('home-menu');
    },

    iconDetails: function (id) {
        var icon = new Icon({_id: id});
        icon.fetch({success: function(){
            $("#content").html(new IconView({model: icon}).el);
        }});
        this.headerView.selectMenuItem();
    },

	addIcon: function() {
        var icon = new Icon();
        $('#content').html(new IconView({model: icon}).el);
        this.headerView.selectMenuItem('add-menu');
	},

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    },
    browse : function(){
        if(!this.browseView) {
            this.browseView = new BrowseView();
        }
        $('#content').html(this.browseView.el);
        this.headerView.selectMenuItem('browse-menu');
    }

});

utils.loadTemplate(['HomeView', 'HeaderView', 'BrowseView', 'IconView', 'IconListItemView', 'AboutView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});
