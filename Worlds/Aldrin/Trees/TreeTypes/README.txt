    Explanation of parameters

Body of the tree

    Min_Trunk_Height: Smallest possible trunk height
    Max_Trunk_Height: Largest possible trunk height
    Trunk_Core_Width: Width of the trunk core. It further increases
        the width of the tree beyond the other width variables. The
        number of roots the tree has corresponds to Trunk_Core_Width^2.
    Core_Wood_ID: Block to be used for the trunk core
    Outer_Wood_ID: Wood to be used for the outer trunk and branches
    Root_Wood_ID: Wood to be used for the roots
    Root_Depth_Mult: Multiplied by the length of roots, which are
       normally the base branch length. 

    Base
	
      Note: These are scaled the same way tree height is scaled
        Min_Trunk_Base_Height: Minimum height of trunk base.
        Max_Trunk_Base_Height: Maximum height of trunk base.
        Min_Trunk_Base_Width: Minimum width of the trunk base
        Max_Trunk_Base_Width: Maximum width of the trunk base.
		
    Middle and Top
        and so on for the other height and width variables...
        Middle does not refer to the exact middle of the tree, 
        but rather the spot where the base ends.
        
    Trunk Angle
        Min_Trunk_Start_Slope= Minimum slope for the bottom of the tree
            slope is the number of blocks that the tree travels vertically
            before it travels horizontally. So a high slope value actually
            means less slope. A slope of 1 means 45 degree angle.
        Max_Trunk_Start_Slope= Maximum slope for bottom. Can be higher
            than the min, just depends on how you want the tree to work.
            It scales with the height.	
        Trunk_Change_Dir_Chance= Chance that the trunk will switch directions
            at each step of the trunk. Can be 0.0 to 1.0.		
		
Branches
    Branch_Start: The part of the tree where branches start, and the
        part of the tree where leaves start for pine style leaves. It can
        be between 0.0 and 1.0, and is scaled to tree height.
    Top_Branch_Direction: The general Y direction of the branches, for the top
        half of the leaves.
    Bottom_Branch_Direction: Y direction for bottom half.
        0 = UP, 1 = SIDEWAYS, 2 = DOWN, 3 = LOPSIDED IN TRUNK DIR

    Probability
    Min_Bottom_Branch_Chance: Minimum branch chance at very base of
        the tree. 1.0 means 100 percent.
	Max_Bottom_Branch_Chance: Figure it out.
	
	Cap_Branch_Chance_Mod: Added to the branch chance for the very
        top of the tree, to promote extra top branchiness! Can be
        negative.
    
    Length
    Min_Bottom_Branch_Length: Minimum length of branches at bottom
	
    Width
    Min_Bottom_Branch_Width: Minimum width of branches at bottom  
    Has_Thick_Cap_Branches: 0 or 1, indicates if the tip top branches 
        should be as thick as the trunk at that point. Making the tree
        look extra branchy.
	
Leaves
    Leaf_ID: Block to be used for leaves
    Leaf_Cap_Shape: Leaf shape for the cap of leaves at the top
        0 = No leaves
        1 = Basic style leaves
        2 = Round Leaves
        3 = Pine Leaves (uses Branch_Start)
    Min_Leaf_Cap_Size: Minimum leaf radius for the cap
    Branch_Leaf_Size_Mod: Added to the radius of leaves for branches
        Can be negative
    Leaf_Color_set: Set of leaf colors to use for the leaf type. Can
        be 0,1 or 2. See leaves.txt
    Has_Droopy_Leaves: 0 or 1, indicates if the tree has willow style droopy leaves
        at end of branches. Can stack with other leaf shapes.
    Droopy_Leaves_Slope: The initial slope of the droopy leaves. 3 means over 3 down 1.
        can be negative
    Droopy_Leaves_dSlope: How fast the slope changes. 1 Is a good value, must be >= 1
    Min_Droopy_Leaves_Length: Minimum length of the droopy leaves
    Max_Droopy_Leaves_Length: Maximum length of the droopy leaves	
	
