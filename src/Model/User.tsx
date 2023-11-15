class User{
    userId!: string;
    name!: string;
    email!: string;
    profilePictureImageUrl? : string;
    channelPermissionList!: [];

    constructor(userId: string, name: string, email: string, channelPermissionList: [], profilePictureImageUrl?: string){
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.profilePictureImageUrl = profilePictureImageUrl;
        this.channelPermissionList = channelPermissionList;
    }

}