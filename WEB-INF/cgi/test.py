import os
import sys
''''
def load_path(filepath):
    """Given a path like /path/to/my_module.pyc (or .py) imports the
    module and returns it
    """
	sys.path.append('/compiled/__pycache__')

    path, fname = os.path.split(filepath)
    modulename, _ = os.path.splitext(fname)

    if path not in sys.path:    
        sys.path.insert(0, path)

    return __import__(modulename)


if __name__ == '__main__':
    # Example usage
    appInfo = load_path('/compiled/__pycache__/appInfo.pyc')
    print(appInfo.deviceType)
	'''
import appInfo

print(appInfo.appId)