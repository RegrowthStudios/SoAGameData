All flora referenced by other functions are defined here.
You may define as many flora as you wish. As long as they are in a biomes flora list, and there is an
appropriate texture, they will appear in the game. Also make sure to set up a flora noise function.

	BlockID: the blockID. DUH. You will get an error if you specify a used ID.
	TextureIndex: the location in the texture files. 0-255 = blockPack1, 256-512 = blockPack2.
	Name: The name. _ will be replaced by spaces in game.
	MeshType: 1 = More complicated mesh, 2 = cross mesh, ideal for plants with a stem in the middle.